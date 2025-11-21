import type { Equipment, Rental, UsageAnalytics } from "../../types"

export function computeUtilization(usage: UsageAnalytics[]): Record<string, number> {
  const map: Record<string, number> = {}
  for (const u of usage) {
    const utilization = u.totalHours > 0 ? (1 - u.idleHours / u.totalHours) * 100 : 0
    map[u.equipmentId] = Math.round(utilization)
  }
  return map
}

export function findUnderUtilized(map: Record<string, number>, thresholdPct = 50): string[] {
  return Object.entries(map)
    .filter(([, util]) => util < thresholdPct)
    .map(([equipmentId]) => equipmentId)
}

export function estimateCurrentAvailability(equipment: Equipment[], rentals: Rental[]): string[] {
  const active = new Set(rentals.filter(r => r.status === "active").map(r => r.equipmentId))
  return equipment.filter(e => !active.has(e.id) && e.status === "available").map(e => e.id)
}


