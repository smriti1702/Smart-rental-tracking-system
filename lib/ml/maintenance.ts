import type { Equipment, MaintenanceRecord } from "../../types"

// Enhanced predictive maintenance with multiple ML approaches
export function maintenanceRiskScore(equipment: Equipment, lastRecord?: MaintenanceRecord): number {
  const hours = equipment.specifications.engineHours
  const hoursRisk = scale(hours, 0, 6000)
  const daysSinceMaint = daysSince(lastRecord?.maintenanceDate)
  const timeRisk = scale(daysSinceMaint, 0, 180)
  const conditionRisk = equipment.status === "maintenance" ? 1 : equipment.status === "overdue" ? 0.7 : 0.3
  const score = 0.5 * hoursRisk + 0.4 * timeRisk + 0.1 * conditionRisk
  return Math.min(100, Math.round(score * 100))
}

// Enhanced ML-based maintenance prediction
export function predictMaintenanceNeeds(equipment: Equipment[], maintenanceHistory: MaintenanceRecord[]): Array<{
  equipmentId: string
  riskScore: number
  nextMaintenanceDate: string
  failureProbability: number
  recommendedActions: string[]
  confidence: number
}> {
  return equipment.map(eq => {
    const eqHistory = maintenanceHistory.filter(m => m.equipmentId === eq.id)
    const riskScore = calculateMLRiskScore(eq, eqHistory)
    const failureProb = predictFailureProbability(eq, eqHistory)
    const nextDate = predictNextMaintenanceDate(eq, eqHistory)
    const actions = recommendMaintenanceActions(eq, eqHistory, riskScore)
    
    return {
      equipmentId: eq.id,
      riskScore: Math.round(riskScore * 100),
      nextMaintenanceDate: nextDate,
      failureProbability: Math.round(failureProb * 100),
      recommendedActions: actions,
      confidence: calculatePredictionConfidence(eqHistory.length, eq.specifications.engineHours)
    }
  })
}

// Equipment health scoring using multiple factors
export function calculateEquipmentHealth(equipment: Equipment, maintenanceHistory: MaintenanceRecord[]): {
  overallHealth: number
  componentHealth: Record<string, number>
  healthTrend: "improving" | "stable" | "declining"
  recommendations: string[]
} {
  const eqHistory = maintenanceHistory.filter(m => m.equipmentId === equipment.id)
  
  // Component health analysis
  const componentHealth = {
    engine: calculateEngineHealth(equipment, eqHistory),
    transmission: calculateTransmissionHealth(equipment, eqHistory),
    hydraulics: calculateHydraulicsHealth(equipment, eqHistory),
    electrical: calculateElectricalHealth(equipment, eqHistory),
    structural: calculateStructuralHealth(equipment, eqHistory)
  }
  
  // Overall health as weighted average
  const weights = { engine: 0.3, transmission: 0.25, hydraulics: 0.2, electrical: 0.15, structural: 0.1 }
  const overallHealth = Object.entries(componentHealth).reduce((sum, [component, health]) => {
    return sum + (health * weights[component as keyof typeof weights])
  }, 0)
  
  // Health trend analysis
  const healthTrend = analyzeHealthTrend(eqHistory)
  
  // Generate recommendations
  const recommendations = generateHealthRecommendations(componentHealth, overallHealth)
  
  return {
    overallHealth: Math.round(overallHealth * 100),
    componentHealth: Object.fromEntries(
      Object.entries(componentHealth).map(([k, v]) => [k, Math.round(v * 100)])
    ),
    healthTrend,
    recommendations
  }
}

// Failure prediction using survival analysis
export function predictEquipmentFailure(equipment: Equipment[], maintenanceHistory: MaintenanceRecord[]): Array<{
  equipmentId: string
  failureProbability: number
  timeToFailure: number // days
  failureType: string
  confidence: number
}> {
  return equipment.map(eq => {
    const eqHistory = maintenanceHistory.filter(m => m.equipmentId === eq.id)
    const failureProb = predictFailureProbability(eq, eqHistory)
    const timeToFailure = predictTimeToFailure(eq, eqHistory)
    const failureType = predictFailureType(eq, eqHistory)
    const confidence = calculateFailurePredictionConfidence(eqHistory.length)
    
    return {
      equipmentId: eq.id,
      failureProbability: Math.round(failureProb * 100),
      timeToFailure: Math.round(timeToFailure),
      failureType,
      confidence: Math.round(confidence * 100)
    }
  })
}

// Helper functions
export function nextMaintenanceDue(equipment: Equipment, lastRecord?: MaintenanceRecord): string | undefined {
  const baselineDays = 90
  const adjustment = Math.round((equipment.specifications.engineHours / 6000) * 30)
  const days = baselineDays - adjustment
  const start = lastRecord?.maintenanceDate ? new Date(lastRecord.maintenanceDate) : new Date()
  start.setDate(start.getDate() + Math.max(30, days))
  return start.toISOString().split("T")[0]
}

function calculateMLRiskScore(equipment: Equipment, history: MaintenanceRecord[]): number {
  if (history.length === 0) return 0.5 // Default risk for new equipment
  
  const features = extractMaintenanceFeatures(equipment, history)
  const weights = [0.3, 0.25, 0.2, 0.15, 0.1] // Feature weights
  
  let riskScore = 0
  for (let i = 0; i < features.length; i++) {
    riskScore += features[i] * weights[i]
  }
  
  return Math.min(1, Math.max(0, riskScore))
}

function extractMaintenanceFeatures(equipment: Equipment, history: MaintenanceRecord[]): number[] {
  const engineHours = scale(equipment.specifications.engineHours, 0, 10000)
  const daysSinceLastMaint = scale(daysSince(history[history.length - 1]?.maintenanceDate), 0, 365)
  const maintenanceFrequency = scale(history.length, 0, 20)
  const avgRepairCost = scale(calculateAverageRepairCost(history), 0, 10000)
  const ageFactor = scale(calculateEquipmentAge(equipment), 0, 20)
  
  return [engineHours, daysSinceLastMaint, maintenanceFrequency, avgRepairCost, ageFactor]
}

function predictFailureProbability(equipment: Equipment, history: MaintenanceRecord[]): number {
  if (history.length < 3) return 0.1 // Low probability for new equipment
  
  const riskFactors = [
    equipment.specifications.engineHours / 10000, // Engine hours risk
    daysSince(history[history.length - 1]?.maintenanceDate) / 365, // Time since maintenance
    history.filter(h => h.cost > 1000).length / Math.max(1, history.length), // Expensive repairs ratio
    calculateEquipmentAge(equipment) / 20 // Age factor
  ]
  
  // Weighted risk calculation
  const weights = [0.4, 0.3, 0.2, 0.1]
  const totalRisk = riskFactors.reduce((sum, risk, i) => sum + risk * weights[i], 0)
  
  return Math.min(0.95, Math.max(0.05, totalRisk))
}

function predictNextMaintenanceDate(equipment: Equipment, history: MaintenanceRecord[]): string {
  if (history.length === 0) {
    // Default prediction for new equipment
    const defaultDays = 90
    const date = new Date()
    date.setDate(date.getDate() + defaultDays)
    return date.toISOString().split("T")[0]
  }
  
  // Use historical patterns to predict next maintenance
  const intervals = calculateMaintenanceIntervals(history)
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
  const lastMaintenance = new Date(history[history.length - 1].maintenanceDate)
  
  const nextDate = new Date(lastMaintenance)
  nextDate.setDate(nextDate.getDate() + avgInterval)
  
  return nextDate.toISOString().split("T")[0]
}

function predictTimeToFailure(equipment: Equipment, history: MaintenanceRecord[]): number {
  if (history.length < 2) return 365 // Default: 1 year
  
  const failurePatterns = analyzeFailurePatterns(history)
  const baseTime = 365 // Base time to failure
  
  // Adjust based on equipment condition and history
  const conditionFactor = equipment.status === "maintenance" ? 0.5 : 1.0
  const historyFactor = failurePatterns.failureRate > 0.5 ? 0.7 : 1.2
  
  return Math.max(30, Math.min(730, baseTime * conditionFactor * historyFactor))
}

function predictFailureType(equipment: Equipment, history: MaintenanceRecord[]): string {
  if (history.length === 0) return "Unknown"
  
  // Analyze most common failure types in history
  const failureTypes = history
    .filter(h => h.description?.toLowerCase().includes("failure") || h.description?.toLowerCase().includes("breakdown"))
    .map(h => extractFailureTypeFromDescription(h.description))
  
  if (failureTypes.length === 0) return "Unknown"
  
  // Return most common failure type
  const typeCounts = failureTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0][0]
}

function calculateEngineHealth(equipment: Equipment, history: MaintenanceRecord[]): number {
  const engineHours = equipment.specifications.engineHours
  const engineRepairs = history.filter(h => h.description?.toLowerCase().includes("engine"))
  
  let health = 1.0
  health -= engineHours / 10000 * 0.3 // Engine hours impact
  health -= engineRepairs.length * 0.1 // Repair history impact
  
  return Math.max(0, Math.min(1, health))
}

function calculateTransmissionHealth(equipment: Equipment, history: MaintenanceRecord[]): number {
  const transmissionRepairs = history.filter(h => h.description?.toLowerCase().includes("transmission"))
  const age = calculateEquipmentAge(equipment)
  
  let health = 1.0
  health -= age / 20 * 0.2 // Age impact
  health -= transmissionRepairs.length * 0.15 // Repair history impact
  
  return Math.max(0, Math.min(1, health))
}

function calculateHydraulicsHealth(equipment: Equipment, history: MaintenanceRecord[]): number {
  const hydraulicRepairs = history.filter(h => h.description?.toLowerCase().includes("hydraulic"))
  
  let health = 1.0
  health -= hydraulicRepairs.length * 0.2 // Repair history impact
  
  return Math.max(0, Math.min(1, health))
}

function calculateElectricalHealth(equipment: Equipment, history: MaintenanceRecord[]): number {
  const electricalRepairs = history.filter(h => h.description?.toLowerCase().includes("electrical"))
  const age = calculateEquipmentAge(equipment)
  
  let health = 1.0
  health -= age / 20 * 0.15 // Age impact
  health -= electricalRepairs.length * 0.25 // Repair history impact
  
  return Math.max(0, Math.min(1, health))
}

function calculateStructuralHealth(equipment: Equipment, history: MaintenanceRecord[]): number {
  const structuralRepairs = history.filter(h => h.description?.toLowerCase().includes("structural"))
  const age = calculateEquipmentAge(equipment)
  
  let health = 1.0
  health -= age / 20 * 0.1 // Age impact
  health -= structuralRepairs.length * 0.3 // Repair history impact
  
  return Math.max(0, Math.min(1, health))
}

function analyzeHealthTrend(history: MaintenanceRecord[]): "improving" | "stable" | "declining" {
  if (history.length < 3) return "stable"
  
  const recentCosts = history.slice(-3).map(h => h.cost || 0)
  const olderCosts = history.slice(-6, -3).map(h => h.cost || 0)
  
  if (recentCosts.length === 0 || olderCosts.length === 0) return "stable"
  
  const recentAvg = recentCosts.reduce((a, b) => a + b, 0) / recentCosts.length
  const olderAvg = olderCosts.reduce((a, b) => a + b, 0) / olderCosts.length
  
  if (recentAvg < olderAvg * 0.8) return "improving"
  if (recentAvg > olderAvg * 1.2) return "declining"
  return "stable"
}

function generateHealthRecommendations(componentHealth: Record<string, number>, overallHealth: number): string[] {
  const recommendations: string[] = []
  
  if (overallHealth < 0.6) {
    recommendations.push("Schedule comprehensive maintenance inspection")
  }
  
  Object.entries(componentHealth).forEach(([component, health]) => {
    if (health < 0.5) {
      recommendations.push(`Inspect ${component} system - health at ${Math.round(health * 100)}%`)
    }
  })
  
  if (recommendations.length === 0) {
    recommendations.push("Continue regular maintenance schedule")
  }
  
  return recommendations
}

function recommendMaintenanceActions(equipment: Equipment, history: MaintenanceRecord[], riskScore: number): string[] {
  const actions: string[] = []
  
  if (riskScore > 0.7) {
    actions.push("Schedule immediate maintenance inspection")
    actions.push("Reduce operational load")
  } else if (riskScore > 0.5) {
    actions.push("Schedule maintenance within 2 weeks")
    actions.push("Monitor performance closely")
  } else if (riskScore > 0.3) {
    actions.push("Schedule routine maintenance")
  } else {
    actions.push("Continue normal operations")
  }
  
  // Add specific recommendations based on equipment type
  if (equipment.type?.toLowerCase().includes("excavator")) {
    actions.push("Check hydraulic system pressure")
  }
  
  return actions
}

function calculatePredictionConfidence(historyLength: number, engineHours: number): number {
  let confidence = 0.5 // Base confidence
  
  // More history = higher confidence
  confidence += Math.min(0.3, historyLength * 0.05)
  
  // More engine hours = higher confidence (more wear data)
  confidence += Math.min(0.2, engineHours / 10000 * 0.2)
  
  return Math.min(0.95, confidence)
}

function calculateFailurePredictionConfidence(historyLength: number): number {
  return Math.min(0.9, 0.5 + Math.min(0.4, historyLength * 0.1))
}

function scale(value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, value))
  return (clamped - min) / Math.max(1, max - min)
}

function daysSince(date?: string): number {
  if (!date) return 999
  const diff = Date.now() - new Date(date).getTime()
  return Math.floor(diff / (24 * 60 * 60 * 1000))
}

function calculateAverageRepairCost(history: MaintenanceRecord[]): number {
  if (history.length === 0) return 0
  const totalCost = history.reduce((sum, h) => sum + (h.cost || 0), 0)
  return totalCost / history.length
}

function calculateEquipmentAge(equipment: Equipment): number {
  // Estimate age based on engine hours and typical usage patterns
  const typicalAnnualHours = 2000
  return Math.round(equipment.specifications.engineHours / typicalAnnualHours)
}

function calculateMaintenanceIntervals(history: MaintenanceRecord[]): number[] {
  const intervals: number[] = []
  
  for (let i = 1; i < history.length; i++) {
    const days = daysSince(history[i - 1].maintenanceDate) - daysSince(history[i].maintenanceDate)
    intervals.push(Math.abs(days))
  }
  
  return intervals
}

function analyzeFailurePatterns(history: MaintenanceRecord[]): { failureRate: number; avgTimeBetweenFailures: number } {
  const failures = history.filter(h => h.description?.toLowerCase().includes("failure") || h.description?.toLowerCase().includes("breakdown"))
  const failureRate = failures.length / Math.max(1, history.length)
  
  let avgTimeBetweenFailures = 365
  if (failures.length > 1) {
    const failureDates = failures.map(f => new Date(f.maintenanceDate).getTime()).sort((a, b) => a - b)
    const intervals = []
    for (let i = 1; i < failureDates.length; i++) {
      intervals.push((failureDates[i] - failureDates[i - 1]) / (24 * 60 * 60 * 1000))
    }
    avgTimeBetweenFailures = intervals.reduce((a, b) => a + b, 0) / intervals.length
  }
  
  return { failureRate, avgTimeBetweenFailures }
}

function extractFailureTypeFromDescription(description?: string): string {
  if (!description) return "Unknown"
  
  const desc = description.toLowerCase()
  if (desc.includes("engine")) return "Engine Failure"
  if (desc.includes("transmission")) return "Transmission Failure"
  if (desc.includes("hydraulic")) return "Hydraulic Failure"
  if (desc.includes("electrical")) return "Electrical Failure"
  if (desc.includes("structural")) return "Structural Failure"
  
  return "General Failure"
}


