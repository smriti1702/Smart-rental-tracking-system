import type { DemandForecastItem, Rental } from "../../types"

// Enhanced time series forecasting with multiple algorithms
export function forecastDemandByType(rentals: Rental[], decayHalfLifeDays = 30): DemandForecastItem[] {
  const now = Date.now()
  const msPerDay = 24 * 60 * 60 * 1000

  const typeToWeightedCount: Record<string, number> = {}

  for (const rental of rentals) {
    const checkOut = new Date(rental.checkOutDate).getTime()
    const ageDays = (now - checkOut) / msPerDay
    const weight = Math.pow(0.5, ageDays / decayHalfLifeDays)

    const inferredType = inferTypeFromEquipmentId(rental.equipmentId)
    typeToWeightedCount[inferredType] = (typeToWeightedCount[inferredType] || 0) + weight
  }

  const max = Math.max(1, ...Object.values(typeToWeightedCount))

  return Object.entries(typeToWeightedCount).map(([equipmentType, value]) => ({
    equipmentType,
    predictedDemand: Math.round((value / max) * 100),
    confidence: 70 + Math.round((value / max) * 30),
  }))
}

// Enhanced exponential smoothing with trend detection
export function forecastDemandWithTrend(rentals: Rental[], periods = 12): DemandForecastItem[] {
  if (rentals.length === 0) return []

  const monthlyData = aggregateByMonth(rentals)
  const types = [...new Set(rentals.map(r => inferTypeFromEquipmentId(r.equipmentId)))]

  return types.map(type => {
    const typeRentals = rentals.filter(r => inferTypeFromEquipmentId(r.equipmentId) === type)
    const monthlyCounts = monthlyData.filter(d => d.type === type).map(d => d.count)
    
    if (monthlyCounts.length < 2) {
      return {
        equipmentType: type,
        predictedDemand: 50,
        confidence: 60,
        trend: "stable",
        nextMonthForecast: monthlyCounts[0] || 0
      }
    }

    const { forecast, trend, confidence } = exponentialSmoothingWithTrend(monthlyCounts, periods)
    
    return {
      equipmentType: type,
      predictedDemand: Math.round((forecast / Math.max(1, Math.max(...monthlyCounts))) * 100),
      confidence: Math.round(confidence * 100),
      trend,
      nextMonthForecast: Math.round(forecast)
    }
  })
}

// Seasonal decomposition for demand forecasting
export function forecastDemandSeasonal(rentals: Rental[], forecastPeriods = 3): DemandForecastItem[] {
  if (rentals.length === 0) return []

  const types = [...new Set(rentals.map(r => inferTypeFromEquipmentId(r.equipmentId)))]
  
  return types.map(type => {
    const typeRentals = rentals.filter(r => inferTypeFromEquipmentId(r.equipmentId) === type)
    const seasonalData = analyzeSeasonality(typeRentals)
    
    const nextPeriodDemand = seasonalData.seasonalFactor * seasonalData.baseDemand
    const confidence = Math.max(60, 100 - seasonalData.volatility * 20)
    
    return {
      equipmentType: type,
      predictedDemand: Math.round((nextPeriodDemand / Math.max(1, seasonalData.maxDemand)) * 100),
      confidence: Math.round(confidence),
      seasonalFactor: seasonalData.seasonalFactor,
      nextPeriodForecast: Math.round(nextPeriodDemand)
    }
  })
}

// Helper functions
function inferTypeFromEquipmentId(equipmentId: string): string {
  if (equipmentId.includes("EQU")) return "General"
  if (equipmentId.includes("EXC")) return "Excavator"
  if (equipmentId.includes("CRN")) return "Crane"
  if (equipmentId.includes("BLD")) return "Bulldozer"
  if (equipmentId.includes("GRD")) return "Grader"
  if (equipmentId.includes("LDR")) return "Loader"
  return "Unknown"
}

function aggregateByMonth(rentals: Rental[]): Array<{ type: string, month: string, count: number }> {
  const monthly: Record<string, Record<string, number>> = {}
  
  rentals.forEach(rental => {
    const type = inferTypeFromEquipmentId(rental.equipmentId)
    const month = new Date(rental.checkOutDate).toISOString().slice(0, 7) // YYYY-MM
    
    if (!monthly[type]) monthly[type] = {}
    monthly[type][month] = (monthly[type][month] || 0) + 1
  })
  
  const result: Array<{ type: string, month: string, count: number }> = []
  Object.entries(monthly).forEach(([type, months]) => {
    Object.entries(months).forEach(([month, count]) => {
      result.push({ type, month, count })
    })
  })
  
  return result.sort((a, b) => a.month.localeCompare(b.month))
}

function exponentialSmoothingWithTrend(data: number[], periods: number): { forecast: number, trend: string, confidence: number } {
  if (data.length < 2) return { forecast: data[0] || 0, trend: "stable", confidence: 0.6 }
  
  // Simple exponential smoothing with trend
  const alpha = 0.3 // smoothing factor
  const beta = 0.1 // trend factor
  
  let level = data[0]
  let trend = 0
  
  for (let i = 1; i < data.length; i++) {
    const prevLevel = level
    level = alpha * data[i] + (1 - alpha) * (level + trend)
    trend = beta * (level - prevLevel) + (1 - beta) * trend
  }
  
  const forecast = level + trend * periods
  const trendDirection = trend > 0.1 ? "increasing" : trend < -0.1 ? "decreasing" : "stable"
  const confidence = Math.max(0.6, 1 - Math.abs(trend) / Math.max(1, level) * 0.4)
  
  return { forecast: Math.max(0, forecast), trend: trendDirection, confidence }
}

function analyzeSeasonality(rentals: Rental[]): { seasonalFactor: number, baseDemand: number, maxDemand: number, volatility: number } {
  if (rentals.length === 0) return { seasonalFactor: 1, baseDemand: 0, maxDemand: 0, volatility: 0 }
  
  const monthlyCounts = new Array(12).fill(0)
  const currentMonth = new Date().getMonth()
  
  rentals.forEach(rental => {
    const month = new Date(rental.checkOutDate).getMonth()
    monthlyCounts[month]++
  })
  
  const baseDemand = monthlyCounts.reduce((a, b) => a + b, 0) / 12
  const seasonalFactor = monthlyCounts[currentMonth] / Math.max(1, baseDemand)
  const maxDemand = Math.max(...monthlyCounts)
  const volatility = Math.sqrt(monthlyCounts.reduce((acc, val) => acc + Math.pow(val - baseDemand, 2), 0) / 12) / Math.max(1, baseDemand)
  
  return { seasonalFactor, baseDemand, maxDemand, volatility }
}


