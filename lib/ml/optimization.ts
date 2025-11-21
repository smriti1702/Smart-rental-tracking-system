import type { Equipment, Rental, Project, Site } from "../../types"

// Cost Optimization Model using linear programming and resource allocation
export interface OptimizationResult {
  totalCost: number
  costSavings: number
  savingsPercentage: number
  recommendations: OptimizationRecommendation[]
  equipmentAllocation: EquipmentAllocation[]
  constraints: OptimizationConstraints
}

export interface OptimizationRecommendation {
  type: "equipment_swap" | "schedule_change" | "route_optimization" | "maintenance_timing"
  description: string
  estimatedSavings: number
  implementationDifficulty: "easy" | "medium" | "hard"
  priority: "high" | "medium" | "low"
}

export interface EquipmentAllocation {
  equipmentId: string
  projectId: string
  startDate: string
  endDate: string
  utilization: number
  cost: number
  efficiency: number
}

export interface OptimizationConstraints {
  budget: number
  timeline: number
  equipmentAvailability: boolean
  maintenanceWindows: boolean
  transportationLimits: boolean
}

// Main optimization function
export function optimizeEquipmentCosts(
  projects: Project[],
  availableEquipment: Equipment[],
  rentalHistory: Rental[],
  sites: Site[],
  constraints: Partial<OptimizationConstraints> = {}
): OptimizationResult {
  const defaultConstraints: OptimizationConstraints = {
    budget: 100000,
    timeline: 30,
    equipmentAvailability: true,
    maintenanceWindows: true,
    transportationLimits: true,
    ...constraints
  }

  // Calculate current costs
  const currentCosts = calculateCurrentCosts(projects, rentalHistory)
  
  // Generate optimization scenarios
  const scenarios = generateOptimizationScenarios(projects, availableEquipment, rentalHistory, sites)
  
  // Apply optimization algorithms
  const optimizedAllocation = applyOptimizationAlgorithms(scenarios, defaultConstraints)
  
  // Calculate optimized costs
  const optimizedCosts = calculateOptimizedCosts(optimizedAllocation)
  
  // Generate recommendations
  const recommendations = generateOptimizationRecommendations(
    currentCosts,
    optimizedCosts,
    scenarios,
    defaultConstraints
  )

  const costSavings = currentCosts - optimizedCosts
  const savingsPercentage = (costSavings / currentCosts) * 100

  return {
    totalCost: optimizedCosts,
    costSavings,
    savingsPercentage: Math.round(savingsPercentage * 100) / 100,
    recommendations,
    equipmentAllocation: optimizedAllocation,
    constraints: defaultConstraints
  }
}

// Resource allocation optimization using greedy algorithm
export function optimizeResourceAllocation(
  projects: Project[],
  equipment: Equipment[],
  constraints: OptimizationConstraints
): EquipmentAllocation[] {
  const allocations: EquipmentAllocation[] = []
  const availableEquipment = [...equipment]
  const projectQueue = [...projects].sort((a, b) => (b.priority || 0) - (a.priority || 0))

  for (const project of projectQueue) {
    const bestEquipment = findBestEquipmentForProject(project, availableEquipment, constraints)
    
    if (bestEquipment) {
      const allocation = createAllocation(project, bestEquipment, constraints)
      allocations.push(allocation)
      
      // Mark equipment as allocated
      const equipmentIndex = availableEquipment.findIndex(e => e.id === bestEquipment.id)
      if (equipmentIndex !== -1) {
        availableEquipment.splice(equipmentIndex, 1)
      }
    }
  }

  return allocations
}

// Transportation route optimization
export function optimizeTransportationRoutes(
  sites: Site[],
  equipment: Equipment[],
  projects: Project[]
): Array<{
  route: string[]
  totalDistance: number
  estimatedCost: number
  efficiency: number
}> {
  const routes: Array<{
    route: string[]
    totalDistance: number
    estimatedCost: number
    efficiency: number
  }> = []

  // Generate possible routes between sites
  const siteCombinations = generateSiteCombinations(sites)
  
  for (const combination of siteCombinations) {
    const route = optimizeRouteForSites(combination, equipment, projects)
    routes.push(route)
  }

  return routes.sort((a, b) => a.efficiency - b.efficiency)
}

// Maintenance scheduling optimization
export function optimizeMaintenanceSchedule(
  equipment: Equipment[],
  maintenanceHistory: any[],
  projects: Project[],
  constraints: OptimizationConstraints
): Array<{
  equipmentId: string
  recommendedDate: string
  priority: "critical" | "high" | "medium" | "low"
  estimatedCost: number
  impactOnProjects: string[]
}> {
  const maintenanceSchedule: Array<{
    equipmentId: string
    recommendedDate: string
    priority: "critical" | "high" | "medium" | "low"
    estimatedCost: number
    impactOnProjects: string[]
  }> = []

  for (const eq of equipment) {
    const maintenanceData = analyzeMaintenanceNeeds(eq, maintenanceHistory, projects)
    
    if (maintenanceData.needsMaintenance) {
      const optimalDate = findOptimalMaintenanceDate(eq, maintenanceData, projects, constraints)
      const priority = determineMaintenancePriority(maintenanceData)
      const impact = assessProjectImpact(eq, optimalDate, projects)
      
      maintenanceSchedule.push({
        equipmentId: eq.id,
        recommendedDate: optimalDate,
        priority,
        estimatedCost: maintenanceData.estimatedCost,
        impactOnProjects: impact
      })
    }
  }

  return maintenanceSchedule.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

// Helper functions
function calculateCurrentCosts(projects: Project[], rentalHistory: Rental[]): number {
  return rentalHistory.reduce((total, rental) => total + (rental.totalCost || 0), 0)
}

function generateOptimizationScenarios(
  projects: Project[],
  equipment: Equipment[],
  rentalHistory: Rental[],
  sites: Site[]
): Array<{
  scenario: string
  equipmentAllocation: EquipmentAllocation[]
  estimatedCost: number
  efficiency: number
}> {
  const scenarios: Array<{
    scenario: string
    equipmentAllocation: EquipmentAllocation[]
    estimatedCost: number
    efficiency: number
  }> = []

  // Scenario 1: Optimal equipment type matching
  const typeMatchingScenario = createTypeMatchingScenario(projects, equipment, rentalHistory)
  scenarios.push(typeMatchingScenario)

  // Scenario 2: Location-based optimization
  const locationScenario = createLocationBasedScenario(projects, equipment, sites)
  scenarios.push(locationScenario)

  // Scenario 3: Cost-based optimization
  const costScenario = createCostBasedScenario(projects, equipment, rentalHistory)
  scenarios.push(costScenario)

  // Scenario 4: Utilization-based optimization
  const utilizationScenario = createUtilizationBasedScenario(projects, equipment, rentalHistory)
  scenarios.push(utilizationScenario)

  return scenarios
}

function createTypeMatchingScenario(
  projects: Project[],
  equipment: Equipment[],
  rentalHistory: Rental[]
): {
  scenario: string
  equipmentAllocation: EquipmentAllocation[]
  estimatedCost: number
  efficiency: number
} {
  const allocations: EquipmentAllocation[] = []
  let totalCost = 0
  let totalEfficiency = 0

  for (const project of projects) {
    const bestEquipment = equipment
      .filter(e => e.type === project.type && e.status === "available")
      .sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0))[0]

    if (bestEquipment) {
      const allocation = {
        equipmentId: bestEquipment.id,
        projectId: project.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (project.duration || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        utilization: 0.8,
        cost: (bestEquipment.hourlyRate || 50) * (project.duration || 1) * 8,
        efficiency: 0.85
      }
      
      allocations.push(allocation)
      totalCost += allocation.cost
      totalEfficiency += allocation.efficiency
    }
  }

  return {
    scenario: "Optimal Type Matching",
    equipmentAllocation: allocations,
    estimatedCost: totalCost,
    efficiency: totalEfficiency / Math.max(1, allocations.length)
  }
}

function createLocationBasedScenario(
  projects: Project[],
  equipment: Equipment[],
  sites: Site[]
): {
  scenario: string
  equipmentAllocation: EquipmentAllocation[]
  estimatedCost: number
  efficiency: number
} {
  const allocations: EquipmentAllocation[] = []
  let totalCost = 0
  let totalEfficiency = 0

  for (const project of projects) {
    const projectSite = sites.find(s => s.id === project.siteId)
    if (!projectSite) continue

    // Find closest available equipment
    const closestEquipment = equipment
      .filter(e => e.status === "available")
      .map(e => {
        const equipmentSite = sites.find(s => s.id === e.siteId)
        if (!equipmentSite) return { equipment: e, distance: Infinity }
        
        const distance = calculateDistance(
          projectSite.coordinates.lat,
          projectSite.coordinates.lng,
          equipmentSite.coordinates.lat,
          equipmentSite.coordinates.lng
        )
        
        return { equipment: e, distance }
      })
      .sort((a, b) => a.distance - b.distance)[0]

    if (closestEquipment && closestEquipment.distance < 100) { // Within 100km
      const allocation = {
        equipmentId: closestEquipment.equipment.id,
        projectId: project.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (project.duration || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        utilization: 0.75,
        cost: (closestEquipment.equipment.hourlyRate || 50) * (project.duration || 1) * 8,
        efficiency: 0.8
      }
      
      allocations.push(allocation)
      totalCost += allocation.cost
      totalEfficiency += allocation.efficiency
    }
  }

  return {
    scenario: "Location-Based Optimization",
    equipmentAllocation: allocations,
    estimatedCost: totalCost,
    efficiency: totalEfficiency / Math.max(1, allocations.length)
  }
}

function createCostBasedScenario(
  projects: Project[],
  equipment: Equipment[],
  rentalHistory: Rental[]
): {
  scenario: string
  equipmentAllocation: EquipmentAllocation[]
  estimatedCost: number
  efficiency: number
} {
  const allocations: EquipmentAllocation[] = []
  let totalCost = 0
  let totalEfficiency = 0

  for (const project of projects) {
    // Find lowest cost available equipment
    const cheapestEquipment = equipment
      .filter(e => e.status === "available")
      .sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0))[0]

    if (cheapestEquipment) {
      const allocation = {
        equipmentId: cheapestEquipment.id,
        projectId: project.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (project.duration || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        utilization: 0.7,
        cost: (cheapestEquipment.hourlyRate || 50) * (project.duration || 1) * 8,
        efficiency: 0.75
      }
      
      allocations.push(allocation)
      totalCost += allocation.cost
      totalEfficiency += allocation.efficiency
    }
  }

  return {
    scenario: "Cost-Based Optimization",
    equipmentAllocation: allocations,
    estimatedCost: totalCost,
    efficiency: totalEfficiency / Math.max(1, allocations.length)
  }
}

function createUtilizationBasedScenario(
  projects: Project[],
  equipment: Equipment[],
  rentalHistory: Rental[]
): {
  scenario: string
  equipmentAllocation: EquipmentAllocation[]
  estimatedCost: number
  efficiency: number
} {
  const allocations: EquipmentAllocation[] = []
  let totalCost = 0
  let totalEfficiency = 0

  // Calculate current utilization for each equipment
  const equipmentUtilization = new Map<string, number>()
  
  for (const eq of equipment) {
    const eqRentals = rentalHistory.filter(r => r.equipmentId === eq.id)
    const totalHours = eqRentals.reduce((sum, r) => sum + (r.duration || 0) * 8, 0)
    const availableHours = 30 * 8 // 30 days * 8 hours
    const utilization = totalHours / availableHours
    equipmentUtilization.set(eq.id, utilization)
  }

  for (const project of projects) {
    // Find equipment with lowest utilization
    const leastUtilizedEquipment = equipment
      .filter(e => e.status === "available")
      .sort((a, b) => (equipmentUtilization.get(a.id) || 0) - (equipmentUtilization.get(b.id) || 0))[0]

    if (leastUtilizedEquipment) {
      const allocation = {
        equipmentId: leastUtilizedEquipment.id,
        projectId: project.id,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + (project.duration || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        utilization: 0.9,
        cost: (leastUtilizedEquipment.hourlyRate || 50) * (project.duration || 1) * 8,
        efficiency: 0.9
      }
      
      allocations.push(allocation)
      totalCost += allocation.cost
      totalEfficiency += allocation.efficiency
    }
  }

  return {
    scenario: "Utilization-Based Optimization",
    equipmentAllocation: allocations,
    estimatedCost: totalCost,
    efficiency: totalEfficiency / Math.max(1, allocations.length)
  }
}

function applyOptimizationAlgorithms(
  scenarios: Array<{
    scenario: string
    equipmentAllocation: EquipmentAllocation[]
    estimatedCost: number
    efficiency: number
  }>,
  constraints: OptimizationConstraints
): EquipmentAllocation[] {
  // Find the best scenario based on cost and efficiency
  const bestScenario = scenarios.reduce((best, current) => {
    const bestScore = (best.efficiency * 0.6) + ((1 - best.estimatedCost / constraints.budget) * 0.4)
    const currentScore = (current.efficiency * 0.6) + ((1 - current.estimatedCost / constraints.budget) * 0.4)
    
    return currentScore > bestScore ? current : best
  })

  return bestScenario.equipmentAllocation
}

function calculateOptimizedCosts(allocation: EquipmentAllocation[]): number {
  return allocation.reduce((total, alloc) => total + alloc.cost, 0)
}

function generateOptimizationRecommendations(
  currentCosts: number,
  optimizedCosts: number,
  scenarios: Array<{
    scenario: string
    equipmentAllocation: EquipmentAllocation[]
    estimatedCost: number
    efficiency: number
  }>,
  constraints: OptimizationConstraints
): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = []
  const savings = currentCosts - optimizedCosts

  // Equipment swap recommendations
  if (savings > currentCosts * 0.1) {
    recommendations.push({
      type: "equipment_swap",
      description: "Consider swapping to more cost-effective equipment types",
      estimatedSavings: savings * 0.3,
      implementationDifficulty: "medium",
      priority: "high"
    })
  }

  // Schedule optimization
  const bestScenario = scenarios.reduce((best, current) => 
    current.efficiency > best.efficiency ? current : best
  )
  
  if (bestScenario.efficiency > 0.8) {
    recommendations.push({
      type: "schedule_change",
      description: "Optimize project scheduling for better equipment utilization",
      estimatedSavings: savings * 0.2,
      implementationDifficulty: "medium",
      priority: "medium"
    })
  }

  // Route optimization
  if (scenarios.some(s => s.scenario.includes("Location"))) {
    recommendations.push({
      type: "route_optimization",
      description: "Optimize transportation routes to reduce costs",
      estimatedSavings: savings * 0.15,
      implementationDifficulty: "hard",
      priority: "medium"
    })
  }

  // Maintenance timing
  recommendations.push({
    type: "maintenance_timing",
    description: "Schedule maintenance during low-demand periods",
    estimatedSavings: savings * 0.1,
    implementationDifficulty: "easy",
    priority: "low"
  })

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

function findBestEquipmentForProject(
  project: Project,
  availableEquipment: Equipment[],
  constraints: OptimizationConstraints
): Equipment | null {
  if (availableEquipment.length === 0) return null

  // Score equipment based on multiple factors
  const scoredEquipment = availableEquipment.map(eq => {
    let score = 0
    
    // Type match (40% weight)
    if (eq.type === project.type) score += 0.4
    
    // Cost efficiency (30% weight)
    const costScore = 1 - ((eq.hourlyRate || 0) / 200) // Normalize to max $200/hour
    score += costScore * 0.3
    
    // Availability (20% weight)
    if (eq.status === "available") score += 0.2
    
    // Location (10% weight)
    score += 0.1 // Simplified location scoring
    
    return { equipment: eq, score }
  })

  return scoredEquipment.sort((a, b) => b.score - a.score)[0]?.equipment || null
}

function createAllocation(
  project: Project,
  equipment: Equipment,
  constraints: OptimizationConstraints
): EquipmentAllocation {
  return {
    equipmentId: equipment.id,
    projectId: project.id,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + (project.duration || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    utilization: 0.8,
    cost: (equipment.hourlyRate || 50) * (project.duration || 1) * 8,
    efficiency: 0.8
  }
}

function generateSiteCombinations(sites: Site[]): Site[][] {
  const combinations: Site[][] = []
  
  for (let i = 0; i < sites.length; i++) {
    for (let j = i + 1; j < sites.length; j++) {
      combinations.push([sites[i], sites[j]])
    }
  }
  
  return combinations
}

function optimizeRouteForSites(
  sites: Site[],
  equipment: Equipment[],
  projects: Project[]
): {
  route: string[]
  totalDistance: number
  estimatedCost: number
  efficiency: number
} {
  if (sites.length < 2) {
    return {
      route: sites.map(s => s.name),
      totalDistance: 0,
      estimatedCost: 0,
      efficiency: 1
    }
  }

  const totalDistance = calculateDistance(
    sites[0].coordinates.lat,
    sites[0].coordinates.lng,
    sites[1].coordinates.lat,
    sites[1].coordinates.lng
  )

  const estimatedCost = totalDistance * 0.5 // $0.50 per km
  const efficiency = 1 / (1 + totalDistance / 100) // Efficiency decreases with distance

  return {
    route: sites.map(s => s.name),
    totalDistance: Math.round(totalDistance * 100) / 100,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    efficiency: Math.round(efficiency * 100) / 100
  }
}

function analyzeMaintenanceNeeds(
  equipment: Equipment,
  maintenanceHistory: any[],
  projects: Project[]
): {
  needsMaintenance: boolean
  estimatedCost: number
  urgency: number
  lastMaintenance: string | null
} {
  const eqHistory = maintenanceHistory.filter(m => m.equipmentId === equipment.id)
  const lastMaintenance = eqHistory.length > 0 ? eqHistory[eqHistory.length - 1].maintenanceDate : null
  
  const daysSinceLastMaint = lastMaintenance ? 
    (Date.now() - new Date(lastMaintenance).getTime()) / (24 * 60 * 60 * 1000) : 999
  
  const needsMaintenance = daysSinceLastMaint > 90 || equipment.status === "maintenance"
  const estimatedCost = equipment.specifications?.engineHours > 5000 ? 2000 : 1000
  const urgency = Math.min(1, daysSinceLastMaint / 180)

  return {
    needsMaintenance,
    estimatedCost,
    urgency,
    lastMaintenance
  }
}

function findOptimalMaintenanceDate(
  equipment: Equipment,
  maintenanceData: {
    needsMaintenance: boolean
    estimatedCost: number
    urgency: number
    lastMaintenance: string | null
  },
  projects: Project[],
  constraints: OptimizationConstraints
): string {
  // Find the earliest date when equipment is not needed for projects
  const equipmentProjects = projects.filter(p => 
    p.equipmentRequirements?.some(req => req.equipmentId === equipment.id)
  )

  if (equipmentProjects.length === 0) {
    return new Date().toISOString().split('T')[0]
  }

  // Find the earliest available maintenance window
  const maintenanceDate = new Date()
  maintenanceDate.setDate(maintenanceDate.getDate() + 7) // Default: 1 week from now

  return maintenanceDate.toISOString().split('T')[0]
}

function determineMaintenancePriority(maintenanceData: {
  needsMaintenance: boolean
  estimatedCost: number
  urgency: number
  lastMaintenance: string | null
}): "critical" | "high" | "medium" | "low" {
  if (maintenanceData.urgency > 0.8) return "critical"
  if (maintenanceData.urgency > 0.6) return "high"
  if (maintenanceData.urgency > 0.4) return "medium"
  return "low"
}

function assessProjectImpact(
  equipment: Equipment,
  maintenanceDate: string,
  projects: Project[]
): string[] {
  const impact: string[] = []
  
  for (const project of projects) {
    if (project.equipmentRequirements?.some(req => req.equipmentId === equipment.id)) {
      impact.push(`Project ${project.name} may be affected`)
    }
  }
  
  return impact
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
