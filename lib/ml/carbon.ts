import type { CarbonEstimate, UsageAnalytics } from "../../types"

// Rough CO2 estimation using fuel efficiency proxy (liters/hr) -> 2.68 kg CO2 per liter diesel
export function estimateCarbon(usage: UsageAnalytics[], kgCO2PerLiter = 2.68): CarbonEstimate[] {
  return usage.map(u => {
    const liters = u.totalHours * Math.max(0.1, 1 / Math.max(0.1, u.fuelEfficiency)) * 10
    const estimatedCO2kg = liters * kgCO2PerLiter
    return {
      equipmentId: u.equipmentId,
      periodHours: u.totalHours,
      estimatedCO2kg: Number(estimatedCO2kg.toFixed(1)),
    }
  })
}


