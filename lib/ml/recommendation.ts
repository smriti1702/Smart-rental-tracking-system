import type { Equipment, Rental, Project, Site } from "../../types"

// Equipment Recommendation Engine using collaborative filtering and similarity metrics
export interface EquipmentRecommendation {
  equipmentId: string
  equipmentType: string
  siteId: string
  score: number
  confidence: number
  reasons: string[]
  estimatedCost: number
  availability: string
  suitability: "excellent" | "good" | "fair" | "poor"
}

// Main recommendation function
export function recommendEquipment(
  project: Project,
  availableEquipment: Equipment[],
  rentalHistory: Rental[],
  sites: Site[],
  maxRecommendations = 5
): EquipmentRecommendation[] {
  if (availableEquipment.length === 0) return []

  const recommendations: EquipmentRecommendation[] = []

  for (const equipment of availableEquipment) {
    const score = calculateEquipmentScore(equipment, project, rentalHistory, sites)
    const confidence = calculateRecommendationConfidence(equipment, rentalHistory)
    const reasons = generateRecommendationReasons(equipment, project, rentalHistory)
    const estimatedCost = estimateProjectCost(equipment, project)
    const availability = determineAvailability(equipment)
    const suitability = determineSuitability(score)

    recommendations.push({
      equipmentId: equipment.id,
      equipmentType: equipment.type || "Unknown",
      siteId: equipment.siteId || "",
      score: Math.round(score * 100),
      confidence: Math.round(confidence * 100),
      reasons,
      estimatedCost,
      availability,
      suitability
    })
  }

  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations)
}

// Collaborative filtering: find similar projects and their equipment choices
export function findSimilarProjects(
  currentProject: Project,
  rentalHistory: Rental[],
  projects: Project[]
): Array<{ project: Project; similarity: number; equipmentUsed: string[] }> {
  const similarities: Array<{ project: Project; similarity: number; equipmentUsed: string[] }> = []

  for (const project of projects) {
    if (project.id === currentProject.id) continue

    const similarity = calculateProjectSimilarity(currentProject, project)
    const equipmentUsed = rentalHistory
      .filter(r => r.projectId === project.id)
      .map(r => r.equipmentId)

    if (similarity > 0.3) { // Minimum similarity threshold
      similarities.push({ project, similarity, equipmentUsed })
    }
  }

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
}

// Equipment similarity based on specifications and usage patterns
export function findSimilarEquipment(
  targetEquipment: Equipment,
  allEquipment: Equipment[],
  rentalHistory: Rental[]
): Array<{ equipment: Equipment; similarity: number; reasons: string[] }> {
  const similarities: Array<{ equipment: Equipment; similarity: number; reasons: string[] }> = []

  for (const equipment of allEquipment) {
    if (equipment.id === targetEquipment.id) continue

    const similarity = calculateEquipmentSimilarity(targetEquipment, equipment, rentalHistory)
    const reasons = generateSimilarityReasons(targetEquipment, equipment)

    if (similarity > 0.4) { // Minimum similarity threshold
      similarities.push({ equipment, similarity, reasons })
    }
  }

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)
}

// Project-based equipment matching
export function matchEquipmentToProject(
  project: Project,
  equipment: Equipment[],
  rentalHistory: Rental[]
): Array<{ equipment: Equipment; matchScore: number; factors: Record<string, number> }> {
  return equipment.map(eq => {
    const factors = {
      typeMatch: calculateTypeMatch(eq, project),
      capacityMatch: calculateCapacityMatch(eq, project),
      locationMatch: calculateLocationMatch(eq, project),
      availabilityMatch: calculateAvailabilityMatch(eq, project),
      costMatch: calculateCostMatch(eq, project),
      reliabilityMatch: calculateReliabilityMatch(eq, rentalHistory)
    }

    const matchScore = Object.values(factors).reduce((sum, factor) => sum + factor, 0) / Object.keys(factors).length

    return {
      equipment: eq,
      matchScore: Math.round(matchScore * 100),
      factors
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}

// Helper functions
function calculateEquipmentScore(
  equipment: Equipment,
  project: Project,
  rentalHistory: Rental[],
  sites: Site[]
): number {
  let score = 0

  // Type compatibility (30% weight)
  score += calculateTypeCompatibility(equipment, project) * 0.3

  // Capacity match (25% weight)
  score += calculateCapacityCompatibility(equipment, project) * 0.25

  // Location proximity (20% weight)
  score += calculateLocationCompatibility(equipment, project, sites) * 0.2

  // Historical performance (15% weight)
  score += calculateHistoricalPerformance(equipment, rentalHistory) * 0.15

  // Cost efficiency (10% weight)
  score += calculateCostEfficiency(equipment, project) * 0.1

  return Math.max(0, Math.min(1, score))
}

function calculateTypeCompatibility(equipment: Equipment, project: Project): number {
  const projectType = project.type?.toLowerCase() || ""
  const equipmentType = equipment.type?.toLowerCase() || ""

  // Exact type match
  if (projectType === equipmentType) return 1.0

  // Type category match
  const typeCategories = {
    "excavation": ["excavator", "bulldozer", "loader"],
    "lifting": ["crane", "loader", "forklift"],
    "grading": ["grader", "bulldozer", "excavator"],
    "transport": ["truck", "trailer", "loader"]
  }

  for (const [category, types] of Object.entries(typeCategories)) {
    if (projectType.includes(category) && types.some(t => equipmentType.includes(t))) {
      return 0.8
    }
  }

  // Partial match
  if (projectType.includes(equipmentType) || equipmentType.includes(projectType)) {
    return 0.6
  }

  return 0.2
}

function calculateCapacityCompatibility(equipment: Equipment, project: Project): number {
  const projectCapacity = project.requiredCapacity || 0
  const equipmentCapacity = equipment.specifications?.capacity || 0

  if (projectCapacity === 0 || equipmentCapacity === 0) return 0.5

  const ratio = equipmentCapacity / projectCapacity

  if (ratio >= 0.8 && ratio <= 1.2) return 1.0 // Optimal range
  if (ratio >= 0.6 && ratio <= 1.5) return 0.8 // Good range
  if (ratio >= 0.4 && ratio <= 2.0) return 0.6 // Acceptable range
  if (ratio >= 0.2 && ratio <= 3.0) return 0.4 // Poor range

  return 0.2
}

function calculateLocationCompatibility(equipment: Equipment, project: Project, sites: Site[]): number {
  const projectSite = sites.find(s => s.id === project.siteId)
  const equipmentSite = sites.find(s => s.id === equipment.siteId)

  if (!projectSite || !equipmentSite) return 0.5

  const distance = calculateDistance(
    projectSite.coordinates.lat,
    projectSite.coordinates.lng,
    equipmentSite.coordinates.lat,
    equipmentSite.coordinates.lng
  )

  // Distance scoring (closer is better)
  if (distance <= 10) return 1.0 // Within 10km
  if (distance <= 25) return 0.9 // Within 25km
  if (distance <= 50) return 0.8 // Within 50km
  if (distance <= 100) return 0.6 // Within 100km
  if (distance <= 200) return 0.4 // Within 200km

  return 0.2
}

function calculateHistoricalPerformance(equipment: Equipment, rentalHistory: Rental[]): number {
  const equipmentRentals = rentalHistory.filter(r => r.equipmentId === equipment.id)
  
  if (equipmentRentals.length === 0) return 0.5

  let performanceScore = 0
  let totalRentals = equipmentRentals.length

  for (const rental of equipmentRentals) {
    // Completion rate
    if (rental.status === "completed") performanceScore += 0.4
    else if (rental.status === "cancelled") performanceScore += 0.1
    else performanceScore += 0.2

    // On-time performance
      if (rental.checkInDate && rental.plannedReturnDate) {
    const actual = new Date(rental.checkInDate)
      const planned = new Date(rental.plannedReturnDate)
      const daysDiff = Math.abs((actual.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= 1) performanceScore += 0.3
      else if (daysDiff <= 3) performanceScore += 0.2
      else if (daysDiff <= 7) performanceScore += 0.1
    }

    // Cost efficiency (lower is better)
    const costPerDay = (rental.totalCost || 0) / Math.max(1, rental.duration || 1)
    if (costPerDay <= 100) performanceScore += 0.3
    else if (costPerDay <= 200) performanceScore += 0.2
    else if (costPerDay <= 300) performanceScore += 0.1
  }

  return Math.min(1, performanceScore / totalRentals)
}

function calculateCostEfficiency(equipment: Equipment, project: Project): number {
  const projectBudget = project.budget || 0
  const estimatedCost = estimateProjectCost(equipment, project)

  if (projectBudget === 0) return 0.5

  const costRatio = estimatedCost / projectBudget

  if (costRatio <= 0.8) return 1.0 // Under budget
  if (costRatio <= 1.0) return 0.9 // Within budget
  if (costRatio <= 1.2) return 0.7 // Slightly over budget
  if (costRatio <= 1.5) return 0.5 // Over budget
  if (costRatio <= 2.0) return 0.3 // Significantly over budget

  return 0.1
}

function calculateProjectSimilarity(project1: Project, project2: Project): number {
  let similarity = 0
  let factors = 0

  // Type similarity
  if (project1.type === project2.type) {
    similarity += 0.3
    factors++
  }

  // Capacity similarity
  const capacityDiff = Math.abs((project1.requiredCapacity || 0) - (project2.requiredCapacity || 0))
  const maxCapacity = Math.max(project1.requiredCapacity || 1, project2.requiredCapacity || 1)
  if (maxCapacity > 0) {
    similarity += (1 - capacityDiff / maxCapacity) * 0.2
    factors++
  }

  // Duration similarity
  const duration1 = project1.duration || 0
  const duration2 = project2.duration || 0
  const maxDuration = Math.max(duration1, duration2)
  if (maxDuration > 0) {
    const durationDiff = Math.abs(duration1 - duration2)
    similarity += (1 - durationDiff / maxDuration) * 0.2
    factors++
  }

  // Budget similarity
  const budget1 = project1.budget || 0
  const budget2 = project2.budget || 0
  const maxBudget = Math.max(budget1, budget2)
  if (maxBudget > 0) {
    const budgetDiff = Math.abs(budget1 - budget2)
    similarity += (1 - budgetDiff / maxBudget) * 0.2
    factors++
  }

  // Site similarity (same region)
  if (project1.siteId && project2.siteId) {
    similarity += 0.1
    factors++
  }

  return factors > 0 ? similarity / factors : 0
}

function calculateEquipmentSimilarity(
  equipment1: Equipment,
  equipment2: Equipment,
  rentalHistory: Rental[]
): number {
  let similarity = 0
  let factors = 0

  // Type similarity
  if (equipment1.type === equipment2.type) {
    similarity += 0.3
    factors++
  }

  // Capacity similarity
  const capacity1 = equipment1.specifications?.capacity || 0
  const capacity2 = equipment2.specifications?.capacity || 0
  const maxCapacity = Math.max(capacity1, capacity2)
  if (maxCapacity > 0) {
    const capacityDiff = Math.abs(capacity1 - capacity2)
    similarity += (1 - capacityDiff / maxCapacity) * 0.25
    factors++
  }

  // Engine hours similarity
  const hours1 = equipment1.specifications?.engineHours || 0
  const hours2 = equipment2.specifications?.engineHours || 0
  const maxHours = Math.max(hours1, hours2)
  if (maxHours > 0) {
    const hoursDiff = Math.abs(hours1 - hours2)
    similarity += (1 - hoursDiff / maxHours) * 0.2
    factors++
  }

  // Usage pattern similarity
  const patternSimilarity = calculateUsagePatternSimilarity(equipment1, equipment2, rentalHistory)
  similarity += patternSimilarity * 0.25
  factors++

  return factors > 0 ? similarity / factors : 0
}

function calculateUsagePatternSimilarity(
  equipment1: Equipment,
  equipment2: Equipment,
  rentalHistory: Rental[]
): number {
  const rentals1 = rentalHistory.filter(r => r.equipmentId === equipment1.id)
  const rentals2 = rentalHistory.filter(r => r.equipmentId === equipment2.id)

  if (rentals1.length === 0 || rentals2.length === 0) return 0.5

  // Average rental duration similarity
  const avgDuration1 = rentals1.reduce((sum, r) => sum + (r.duration || 0), 0) / rentals1.length
  const avgDuration2 = rentals2.reduce((sum, r) => sum + (r.duration || 0), 0) / rentals2.length
  const maxDuration = Math.max(avgDuration1, avgDuration2)
  
  let durationSimilarity = 0
  if (maxDuration > 0) {
    const durationDiff = Math.abs(avgDuration1 - avgDuration2)
    durationSimilarity = 1 - durationDiff / maxDuration
  }

  // Utilization rate similarity
  const avgUtilization1 = rentals1.reduce((sum, r) => sum + (r.utilizationRate || 0), 0) / rentals1.length
  const avgUtilization2 = rentals2.reduce((sum, r) => sum + (r.utilizationRate || 0), 0) / rentals2.length
  const maxUtilization = Math.max(avgUtilization1, avgUtilization2)
  
  let utilizationSimilarity = 0
  if (maxUtilization > 0) {
    const utilizationDiff = Math.abs(avgUtilization1 - avgUtilization2)
    utilizationSimilarity = 1 - utilizationDiff / maxUtilization
  }

  return (durationSimilarity + utilizationSimilarity) / 2
}

function calculateRecommendationConfidence(equipment: Equipment, rentalHistory: Rental[]): number {
  const rentals = rentalHistory.filter(r => r.equipmentId === equipment.id)
  
  if (rentals.length === 0) return 0.5

  let confidence = 0.5 // Base confidence

  // More rental history = higher confidence
  confidence += Math.min(0.3, rentals.length * 0.05)

  // Recent activity = higher confidence
  const recentRentals = rentals.filter(r => {
    const rentalDate = new Date(r.checkOutDate)
    const daysAgo = (Date.now() - rentalDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysAgo <= 90
  })
  confidence += Math.min(0.2, recentRentals.length * 0.1)

  return Math.min(0.95, confidence)
}

function generateRecommendationReasons(
  equipment: Equipment,
  project: Project,
  rentalHistory: Rental[]
): string[] {
  const reasons: string[] = []
  const rentals = rentalHistory.filter(r => r.equipmentId === equipment.id)

  // Type match
  if (equipment.type === project.type) {
    reasons.push("Perfect type match for project requirements")
  } else if (equipment.type && project.type) {
    reasons.push(`Equipment type (${equipment.type}) suitable for ${project.type} projects`)
  }

  // Capacity match
  const projectCapacity = project.requiredCapacity || 0
  const equipmentCapacity = equipment.specifications?.capacity || 0
  if (projectCapacity > 0 && equipmentCapacity > 0) {
    if (Math.abs(equipmentCapacity - projectCapacity) / projectCapacity <= 0.2) {
      reasons.push("Capacity closely matches project requirements")
    }
  }

  // Performance history
  if (rentals.length > 0) {
    const completedRentals = rentals.filter(r => r.status === "completed").length
    const completionRate = completedRentals / rentals.length
    if (completionRate >= 0.9) {
      reasons.push("Excellent completion rate in previous rentals")
    } else if (completionRate >= 0.8) {
      reasons.push("Good completion rate in previous rentals")
    }
  }

  // Cost efficiency
  const estimatedCost = estimateProjectCost(equipment, project)
  const projectBudget = project.budget || 0
  if (projectBudget > 0 && estimatedCost <= projectBudget) {
    reasons.push("Estimated cost within project budget")
  }

  return reasons
}

function generateSimilarityReasons(equipment1: Equipment, equipment2: Equipment): string[] {
  const reasons: string[] = []

  if (equipment1.type === equipment2.type) {
    reasons.push("Same equipment type")
  }

  const capacity1 = equipment1.specifications?.capacity || 0
  const capacity2 = equipment2.specifications?.capacity || 0
  if (capacity1 > 0 && capacity2 > 0) {
    const capacityDiff = Math.abs(capacity1 - capacity2) / Math.max(capacity1, capacity2)
    if (capacityDiff <= 0.2) {
      reasons.push("Similar capacity specifications")
    }
  }

  const hours1 = equipment1.specifications?.engineHours || 0
  const hours2 = equipment2.specifications?.engineHours || 0
  if (hours1 > 0 && hours2 > 0) {
    const hoursDiff = Math.abs(hours1 - hours2) / Math.max(hours1, hours2)
    if (hoursDiff <= 0.3) {
      reasons.push("Similar usage history")
    }
  }

  return reasons
}

function estimateProjectCost(equipment: Equipment, project: Project): number {
  const baseHourlyRate = equipment.hourlyRate || 50
  const projectDuration = project.duration || 1
  
  // Base cost
  let cost = baseHourlyRate * projectDuration * 8 // 8 hours per day

  // Add transportation cost if needed
  const transportationCost = 100 // Base transportation cost

  // Add maintenance buffer
  const maintenanceBuffer = cost * 0.1

  return Math.round(cost + transportationCost + maintenanceBuffer)
}

function determineAvailability(equipment: Equipment): string {
  if (equipment.status === "available") return "Available now"
  if (equipment.status === "maintenance") return "Under maintenance"
  if (equipment.status === "rented") return "Currently rented"
  if (equipment.status === "overdue") return "Overdue for return"
  
  return "Status unknown"
}

function determineSuitability(score: number): "excellent" | "good" | "fair" | "poor" {
  if (score >= 0.8) return "excellent"
  if (score >= 0.6) return "good"
  if (score >= 0.4) return "fair"
  return "poor"
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Additional helper functions for specific calculations
function calculateTypeMatch(equipment: Equipment, project: Project): number {
  return calculateTypeCompatibility(equipment, project)
}

function calculateCapacityMatch(equipment: Equipment, project: Project): number {
  return calculateCapacityCompatibility(equipment, project)
}

function calculateLocationMatch(equipment: Equipment, project: Project): number {
  // Simplified location match - would need sites data for full implementation
  return 0.7
}

function calculateAvailabilityMatch(equipment: Equipment, project: Project): number {
  if (equipment.status === "available") return 1.0
  if (equipment.status === "maintenance") return 0.0
  if (equipment.status === "rented") return 0.3
  return 0.5
}

function calculateCostMatch(equipment: Equipment, project: Project): number {
  return calculateCostEfficiency(equipment, project)
}

function calculateReliabilityMatch(equipment: Equipment, rentalHistory: Rental[]): number {
  return calculateHistoricalPerformance(equipment, rentalHistory)
}
