import type { Equipment, Project, Site, Rental } from "../../types"

// Weather Impact Analysis Model for equipment performance and project planning
export interface WeatherData {
  date: string
  temperature: number // Celsius
  humidity: number // Percentage
  precipitation: number // mm
  windSpeed: number // km/h
  visibility: number // km
  conditions: WeatherCondition
}

export type WeatherCondition = 
  | "clear" 
  | "cloudy" 
  | "rain" 
  | "snow" 
  | "storm" 
  | "fog" 
  | "extreme_heat" 
  | "extreme_cold"

export interface WeatherImpact {
  equipmentId: string
  date: string
  impactScore: number // 0-100, higher = more impact
  performanceReduction: number // Percentage reduction in performance
  riskLevel: "low" | "medium" | "high" | "critical"
  recommendations: string[]
  estimatedDelay: number // Hours
}

export interface ProjectWeatherRisk {
  projectId: string
  projectName: string
  riskScore: number
  highRiskDates: string[]
  recommendedActions: string[]
  estimatedCostImpact: number
}

// Main weather impact analysis function
export function analyzeWeatherImpact(
  equipment: Equipment[],
  projects: Project[],
  sites: Site[],
  weatherForecast: WeatherData[],
  rentalHistory: Rental[]
): {
  equipmentImpacts: WeatherImpact[]
  projectRisks: ProjectWeatherRisk[]
  overallRiskAssessment: string
  recommendations: string[]
} {
  const equipmentImpacts: WeatherImpact[] = []
  const projectRisks: ProjectWeatherRisk[] = []

  // Analyze weather impact on each equipment
  for (const eq of equipment) {
    const site = sites.find(s => s.id === eq.siteId)
    if (!site) continue

    for (const weather of weatherForecast) {
      const impact = calculateEquipmentWeatherImpact(eq, weather, site, rentalHistory)
      if (impact.impactScore > 20) { // Only report significant impacts
        equipmentImpacts.push(impact)
      }
    }
  }

  // Analyze weather impact on each project
  for (const project of projects) {
    const site = sites.find(s => s.id === project.siteId)
    if (!site) continue

    const risk = calculateProjectWeatherRisk(project, site, weatherForecast, equipmentImpacts)
    projectRisks.push(risk)
  }

  // Overall risk assessment
  const overallRisk = calculateOverallRisk(equipmentImpacts, projectRisks)
  
  // Generate recommendations
  const recommendations = generateWeatherRecommendations(equipmentImpacts, projectRisks, weatherForecast)

  return {
    equipmentImpacts,
    projectRisks,
    overallRiskAssessment: overallRisk,
    recommendations
  }
}

// Weather-based equipment scheduling optimization
export function optimizeScheduleForWeather(
  projects: Project[],
  equipment: Equipment[],
  sites: Site[],
  weatherForecast: WeatherData[],
  constraints: {
    maxDelay: number
    priorityProjects: string[]
    weatherThreshold: number
  } = {
    maxDelay: 48, // Maximum delay in hours
    priorityProjects: [],
    weatherThreshold: 70 // Weather impact threshold
  }
): Array<{
  projectId: string
  originalStartDate: string
  recommendedStartDate: string
  delay: number
  reason: string
  costImpact: number
}> {
  const scheduleOptimizations: Array<{
    projectId: string
    originalStartDate: string
    recommendedStartDate: string
    delay: number
    reason: string
    costImpact: number
  }> = []

  for (const project of projects) {
    const site = sites.find(s => s.id === project.siteId)
    if (!site) continue

    const weatherRisk = calculateProjectWeatherRisk(project, site, weatherForecast, [])
    
    if (weatherRisk.riskScore > constraints.weatherThreshold) {
      const optimalDate = findOptimalStartDate(project, site, weatherForecast, constraints)
      const delay = calculateDelay(project.startDate, optimalDate)
      const costImpact = estimateDelayCost(project, delay)
      
      if (delay <= constraints.maxDelay) {
        scheduleOptimizations.push({
          projectId: project.id,
          originalStartDate: project.startDate,
          recommendedStartDate: optimalDate,
          delay,
          reason: `High weather risk (${weatherRisk.riskScore}/100)`,
          costImpact
        })
      }
    }
  }

  // Sort by priority and cost impact
  return scheduleOptimizations.sort((a, b) => {
    const aPriority = constraints.priorityProjects.includes(a.projectId) ? 1 : 0
    const bPriority = constraints.priorityProjects.includes(b.projectId) ? 1 : 0
    
    if (aPriority !== bPriority) return bPriority - aPriority
    return b.costImpact - a.costImpact
  })
}

// Equipment performance prediction based on weather
export function predictEquipmentPerformance(
  equipment: Equipment,
  weatherData: WeatherData,
  site: Site,
  rentalHistory: Rental[]
): {
  expectedPerformance: number // Percentage of normal performance
  riskFactors: string[]
  maintenanceRecommendations: string[]
  operationalGuidelines: string[]
} {
  const basePerformance = 100
  let performanceReduction = 0
  const riskFactors: string[] = []
  const maintenanceRecommendations: string[] = []
  const operationalGuidelines: string[] = []

  // Temperature impact
  if (weatherData.temperature < -10) {
    performanceReduction += 25
    riskFactors.push("Extreme cold affecting hydraulic systems")
    maintenanceRecommendations.push("Check hydraulic fluid viscosity")
    operationalGuidelines.push("Warm up equipment for 15 minutes before operation")
  } else if (weatherData.temperature > 35) {
    performanceReduction += 20
    riskFactors.push("High temperature affecting engine performance")
    maintenanceRecommendations.push("Monitor engine temperature closely")
    operationalGuidelines.push("Reduce load during peak heat hours")
  }

  // Precipitation impact
  if (weatherData.precipitation > 10) {
    performanceReduction += 15
    riskFactors.push("Wet conditions affecting traction and visibility")
    operationalGuidelines.push("Reduce speed and increase following distance")
  }

  // Wind impact
  if (weatherData.windSpeed > 30) {
    performanceReduction += 20
    riskFactors.push("High winds affecting stability")
    operationalGuidelines.push("Avoid high-lift operations")
    if (equipment.type?.toLowerCase().includes("crane")) {
      performanceReduction += 15
      operationalGuidelines.push("Consider stopping crane operations")
    }
  }

  // Visibility impact
  if (weatherData.visibility < 1) {
    performanceReduction += 30
    riskFactors.push("Poor visibility affecting safety")
    operationalGuidelines.push("Stop operations until visibility improves")
  }

  // Equipment-specific considerations
  const equipmentSpecificImpact = calculateEquipmentSpecificWeatherImpact(equipment, weatherData)
  performanceReduction += equipmentSpecificImpact.reduction
  riskFactors.push(...equipmentSpecificImpact.risks)
  maintenanceRecommendations.push(...equipmentSpecificImpact.maintenance)

  const expectedPerformance = Math.max(0, basePerformance - performanceReduction)

  return {
    expectedPerformance,
    riskFactors,
    maintenanceRecommendations,
    operationalGuidelines
  }
}

// Weather-based maintenance scheduling
export function optimizeMaintenanceForWeather(
  equipment: Equipment[],
  maintenanceHistory: any[],
  weatherForecast: WeatherData[],
  projects: Project[]
): Array<{
  equipmentId: string
  recommendedDate: string
  weatherScore: number
  priority: "high" | "medium" | "low"
  reason: string
}> {
  const maintenanceSchedule: Array<{
    equipmentId: string
    recommendedDate: string
    weatherScore: number
    priority: "high" | "medium" | "low"
    reason: string
  }> = []

  for (const eq of equipment) {
    const maintenanceNeeds = analyzeMaintenanceNeeds(eq, maintenanceHistory)
    
    if (maintenanceNeeds.needsMaintenance) {
      const optimalDate = findOptimalMaintenanceDate(eq, maintenanceNeeds, weatherForecast, projects)
      const weatherScore = calculateWeatherScoreForDate(optimalDate, weatherForecast)
      const priority = determineMaintenancePriority(maintenanceNeeds, weatherScore)
      
      maintenanceSchedule.push({
        equipmentId: eq.id,
        recommendedDate: optimalDate,
        weatherScore,
        priority,
        reason: maintenanceNeeds.reason
      })
    }
  }

  return maintenanceSchedule.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

// Helper functions
function calculateEquipmentWeatherImpact(
  equipment: Equipment,
  weather: WeatherData,
  site: Site,
  rentalHistory: Rental[]
): WeatherImpact {
  const performance = predictEquipmentPerformance(equipment, weather, site, rentalHistory)
  const impactScore = 100 - performance.expectedPerformance
  const riskLevel = determineRiskLevel(impactScore)
  const estimatedDelay = calculateEstimatedDelay(impactScore, weather.conditions)
  
  return {
    equipmentId: equipment.id,
    date: weather.date,
    impactScore: Math.round(impactScore),
    performanceReduction: Math.round(100 - performance.expectedPerformance),
    riskLevel,
    recommendations: performance.operationalGuidelines,
    estimatedDelay
  }
}

function calculateProjectWeatherRisk(
  project: Project,
  site: Site,
  weatherForecast: WeatherData[],
  equipmentImpacts: WeatherImpact[]
): ProjectWeatherRisk {
  let totalRisk = 0
  const highRiskDates: string[] = []
  let totalCostImpact = 0

  for (const weather of weatherForecast) {
    const dailyRisk = calculateDailyWeatherRisk(weather, site, project)
    totalRisk += dailyRisk
    
    if (dailyRisk > 70) {
      highRiskDates.push(weather.date)
      totalCostImpact += estimateDailyCostImpact(project, dailyRisk)
    }
  }

  const averageRisk = totalRisk / weatherForecast.length
  const recommendations = generateProjectWeatherRecommendations(averageRisk, highRiskDates, site)

  return {
    projectId: project.id,
    projectName: project.name || "Unknown Project",
    riskScore: Math.round(averageRisk),
    highRiskDates,
    recommendedActions: recommendations,
    estimatedCostImpact: Math.round(totalCostImpact)
  }
}

function calculateDailyWeatherRisk(weather: WeatherData, site: Site, project: Project): number {
  let risk = 0

  // Base weather risk
  if (weather.conditions === "storm") risk += 40
  else if (weather.conditions === "extreme_heat" || weather.conditions === "extreme_cold") risk += 30
  else if (weather.conditions === "rain" || weather.conditions === "snow") risk += 20
  else if (weather.conditions === "fog") risk += 25

  // Temperature extremes
  if (weather.temperature < -15 || weather.temperature > 40) risk += 20
  else if (weather.temperature < -5 || weather.temperature > 35) risk += 10

  // Wind risk
  if (weather.windSpeed > 40) risk += 30
  else if (weather.windSpeed > 25) risk += 15

  // Precipitation risk
  if (weather.precipitation > 20) risk += 25
  else if (weather.precipitation > 10) risk += 15

  // Visibility risk
  if (weather.visibility < 0.5) risk += 30
  else if (weather.visibility < 2) risk += 15

  // Project-specific considerations
  if (project.type?.toLowerCase().includes("outdoor")) risk += 10
  if (project.type?.toLowerCase().includes("aerial")) risk += 20

  return Math.min(100, risk)
}

function calculateEquipmentSpecificWeatherImpact(
  equipment: Equipment,
  weather: WeatherData
): {
  reduction: number
  risks: string[]
  maintenance: string[]
} {
  let reduction = 0
  const risks: string[] = []
  const maintenance: string[] = []

  const equipmentType = equipment.type?.toLowerCase() || ""

  if (equipmentType.includes("crane")) {
    if (weather.windSpeed > 20) {
      reduction += 25
      risks.push("High winds affecting crane stability")
      maintenance.push("Check wind sensors and safety systems")
    }
  }

  if (equipmentType.includes("excavator") || equipmentType.includes("bulldozer")) {
    if (weather.precipitation > 15) {
      reduction += 20
      risks.push("Wet ground affecting traction")
      maintenance.push("Check tire/undercarriage condition")
    }
  }

  if (equipmentType.includes("loader")) {
    if (weather.visibility < 2) {
      reduction += 30
      risks.push("Poor visibility affecting loading operations")
      maintenance.push("Check lighting and visibility systems")
    }
  }

  return { reduction, risks, maintenance }
}

function determineRiskLevel(impactScore: number): "low" | "medium" | "high" | "critical" {
  if (impactScore >= 80) return "critical"
  if (impactScore >= 60) return "high"
  if (impactScore >= 40) return "medium"
  return "low"
}

function calculateEstimatedDelay(impactScore: number, conditions: WeatherCondition): number {
  if (conditions === "storm") return Math.min(24, impactScore / 4)
  if (conditions === "extreme_heat" || conditions === "extreme_cold") return Math.min(12, impactScore / 6)
  if (conditions === "fog") return Math.min(8, impactScore / 8)
  return Math.min(4, impactScore / 10)
}

function calculateOverallRisk(
  equipmentImpacts: WeatherImpact[],
  projectRisks: ProjectWeatherRisk[]
): string {
  const avgEquipmentRisk = equipmentImpacts.reduce((sum, impact) => sum + impact.impactScore, 0) / Math.max(1, equipmentImpacts.length)
  const avgProjectRisk = projectRisks.reduce((sum, risk) => sum + risk.riskScore, 0) / Math.max(1, projectRisks.length)
  
  const overallRisk = (avgEquipmentRisk + avgProjectRisk) / 2
  
  if (overallRisk >= 80) return "Critical - Immediate action required"
  if (overallRisk >= 60) return "High - Significant weather impact expected"
  if (overallRisk >= 40) return "Medium - Moderate weather impact expected"
  if (overallRisk >= 20) return "Low - Minor weather impact expected"
  return "Minimal - Weather conditions favorable"
}

function generateWeatherRecommendations(
  equipmentImpacts: WeatherImpact[],
  projectRisks: ProjectWeatherRisk[],
  weatherForecast: WeatherData[]
): string[] {
  const recommendations: string[] = []

  // High-impact weather conditions
  const criticalWeather = weatherForecast.filter(w => 
    w.conditions === "storm" || w.conditions === "extreme_heat" || w.conditions === "extreme_cold"
  )
  
  if (criticalWeather.length > 0) {
    recommendations.push("Consider postponing non-critical operations during extreme weather")
  }

  // High-risk projects
  const highRiskProjects = projectRisks.filter(r => r.riskScore > 70)
  if (highRiskProjects.length > 0) {
    recommendations.push("Review and potentially reschedule high-risk projects")
  }

  // Equipment protection
  const highImpactEquipment = equipmentImpacts.filter(i => i.impactScore > 60)
  if (highImpactEquipment.length > 0) {
    recommendations.push("Implement additional protection measures for affected equipment")
  }

  // General recommendations
  recommendations.push("Monitor weather forecasts regularly and adjust schedules accordingly")
  recommendations.push("Ensure all equipment has proper weather protection systems")
  recommendations.push("Train operators on weather-related safety procedures")

  return recommendations
}

function findOptimalStartDate(
  project: Project,
  site: Site,
  weatherForecast: WeatherData[],
  constraints: {
    maxDelay: number
    priorityProjects: string[]
    weatherThreshold: number
  }
): string {
  const projectStart = new Date(project.startDate)
  let optimalDate = projectStart.toISOString().split('T')[0]
  
  // Look for the next available date with acceptable weather
  for (let i = 1; i <= constraints.maxDelay / 24; i++) {
    const checkDate = new Date(projectStart)
    checkDate.setDate(checkDate.getDate() + i)
    
    const weatherForDate = weatherForecast.find(w => w.date === checkDate.toISOString().split('T')[0])
    if (weatherForDate) {
      const dailyRisk = calculateDailyWeatherRisk(weatherForDate, site, project)
      if (dailyRisk <= constraints.weatherThreshold) {
        optimalDate = checkDate.toISOString().split('T')[0]
        break
      }
    }
  }
  
  return optimalDate
}

function calculateDelay(originalDate: string, newDate: string): number {
  const original = new Date(originalDate)
  const newDateObj = new Date(newDate)
  return (newDateObj.getTime() - original.getTime()) / (1000 * 60 * 60) // Hours
}

function estimateDelayCost(project: Project, delayHours: number): number {
  const hourlyCost = project.budget ? project.budget / (project.duration || 1) / 8 : 100
  return hourlyCost * delayHours
}

function estimateDailyCostImpact(project: Project, dailyRisk: number): number {
  const baseDailyCost = project.budget ? project.budget / (project.duration || 1) : 1000
  return baseDailyCost * (dailyRisk / 100)
}

function generateProjectWeatherRecommendations(
  averageRisk: number,
  highRiskDates: string[],
  site: Site
): string[] {
  const recommendations: string[] = []

  if (averageRisk > 70) {
    recommendations.push("Consider postponing project start date")
    recommendations.push("Implement additional weather protection measures")
  } else if (averageRisk > 50) {
    recommendations.push("Monitor weather conditions closely")
    recommendations.push("Have backup plans for high-risk days")
  }

  if (highRiskDates.length > 0) {
    recommendations.push(`High-risk weather expected on: ${highRiskDates.slice(0, 3).join(', ')}`)
  }

  recommendations.push("Ensure site has proper drainage and weather protection")
  recommendations.push("Coordinate with weather services for real-time updates")

  return recommendations
}

function analyzeMaintenanceNeeds(
  equipment: Equipment,
  maintenanceHistory: any[]
): {
  needsMaintenance: boolean
  reason: string
  urgency: number
} {
  const eqHistory = maintenanceHistory.filter(m => m.equipmentId === equipment.id)
  const lastMaintenance = eqHistory.length > 0 ? eqHistory[eqHistory.length - 1].maintenanceDate : null
  
  const daysSinceLastMaint = lastMaintenance ? 
    (Date.now() - new Date(lastMaintenance).getTime()) / (24 * 60 * 60 * 1000) : 999
  
  const needsMaintenance = daysSinceLastMaint > 90 || equipment.status === "maintenance"
  const urgency = Math.min(1, daysSinceLastMaint / 180)
  
  let reason = ""
  if (daysSinceLastMaint > 90) reason = "Regular maintenance due"
  if (equipment.status === "maintenance") reason = "Equipment currently under maintenance"
  
  return { needsMaintenance, reason, urgency }
}

function findOptimalMaintenanceDate(
  equipment: Equipment,
  maintenanceNeeds: {
    needsMaintenance: boolean
    reason: string
    urgency: number
  },
  weatherForecast: WeatherData[],
  projects: Project[]
): string {
  // Find the earliest date with favorable weather for maintenance
  const maintenanceDate = new Date()
  maintenanceDate.setDate(maintenanceDate.getDate() + 1) // Start from tomorrow
  
  for (let i = 1; i <= 30; i++) { // Look up to 30 days ahead
    const checkDate = new Date(maintenanceDate)
    checkDate.setDate(checkDate.getDate() + i)
    
    const weatherForDate = weatherForecast.find(w => w.date === checkDate.toISOString().split('T')[0])
    if (weatherForDate) {
      // Prefer clear, moderate weather for maintenance
      if (weatherForDate.conditions === "clear" && 
          weatherForDate.temperature >= 10 && 
          weatherForDate.temperature <= 25 &&
          weatherForDate.precipitation < 5) {
        return checkDate.toISOString().split('T')[0]
      }
    }
  }
  
  // If no ideal weather found, return a reasonable date
  maintenanceDate.setDate(maintenanceDate.getDate() + 7)
  return maintenanceDate.toISOString().split('T')[0]
}

function calculateWeatherScoreForDate(date: string, weatherForecast: WeatherData[]): number {
  const weather = weatherForecast.find(w => w.date === date)
  if (!weather) return 50 // Neutral score if no weather data
  
  let score = 100
  
  // Reduce score for unfavorable conditions
  if (weather.conditions === "storm") score -= 40
  else if (weather.conditions === "extreme_heat" || weather.conditions === "extreme_cold") score -= 30
  else if (weather.conditions === "rain" || weather.conditions === "snow") score -= 20
  
  if (weather.temperature < -10 || weather.temperature > 35) score -= 20
  if (weather.precipitation > 15) score -= 15
  if (weather.windSpeed > 25) score -= 15
  if (weather.visibility < 2) score -= 20
  
  return Math.max(0, score)
}

function determineMaintenancePriority(
  maintenanceNeeds: {
    needsMaintenance: boolean
    reason: string
    urgency: number
  },
  weatherScore: number
): "high" | "medium" | "low" {
  if (maintenanceNeeds.urgency > 0.8) return "high"
  if (maintenanceNeeds.urgency > 0.6) return "medium"
  if (weatherScore < 50) return "low" // Postpone if weather is poor
  return "medium"
}
