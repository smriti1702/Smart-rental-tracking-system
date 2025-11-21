import type { Alert, AlertSeverity, Equipment, Rental, UsageAnalytics } from "../../types"

export function buildAlerts(
  equipment: Equipment[],
  rentals: Rental[],
  usage: UsageAnalytics[],
): Alert[] {
  const alerts: Alert[] = []

  // Overdue
  const now = new Date()
  for (const r of rentals) {
    if (r.status === "active" && new Date(r.plannedReturnDate) < now) {
      alerts.push(createAlert(r.equipmentId, "overdue", "high", `Equipment ${r.equipmentId} is overdue for return`))
    }
  }

  // Under-utilized
  const utilMap = new Map(usage.map(u => [u.equipmentId, u.utilizationRate]))
  for (const e of equipment) {
    const util = utilMap.get(e.id)
    if (typeof util === "number" && util < 50) {
      alerts.push(createAlert(e.id, "under_utilized", "medium", `Utilization ${util}% is below threshold`))
    }
  }

  // Ghost asset: checked out but engine hours unchanged for days
  for (const r of rentals) {
    if (r.status === "active") {
      const hoursDelta = (r.engineHoursEnd ?? r.engineHoursStart) - r.engineHoursStart
      const daysActive = Math.max(1, daysBetween(r.checkOutDate, now.toISOString()))
      if (hoursDelta < 2 && daysActive > 3) {
        alerts.push(createAlert(r.equipmentId, "ghost_asset", "high", `No usage detected for ${daysActive} days while checked out`))
      }
    }
  }

  return alerts
}

function createAlert(equipmentId: string, type: Alert["type"], severity: AlertSeverity, message: string): Alert {
  return {
    id: `ALT_${equipmentId}_${Date.now()}`,
    type,
    equipmentId,
    message,
    severity,
    timestamp: new Date().toISOString(),
    acknowledged: false,
  }
}

function daysBetween(a: string, b: string): number {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / (24 * 60 * 60 * 1000))
}


