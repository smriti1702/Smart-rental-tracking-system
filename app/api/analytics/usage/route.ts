import { NextResponse } from "next/server"
import { createClient } from "../../../../lib/supabase/server"
import type { UsageAnalytics } from "../../../../types"

export async function GET() {
  const supabase = await createClient()

  const { data: rentals } = await supabase
    .from("rentals")
    .select("id, equipment_id, check_out_engine_hours, check_in_engine_hours, status, check_out_date, actual_return_date")

  const { data: equipment } = await supabase
    .from("equipment")
    .select("id, equipment_id, engine_hours, type, status")

  const equipmentIdSet = new Set<string>((equipment || []).map((e: any) => e.id))

  const byEquip: Record<string, { totalDelta: number; count: number }> = {}
  for (const r of rentals || []) {
    if (!r.equipment_id || !equipmentIdSet.has(r.equipment_id)) continue
    const start = Number(r.check_out_engine_hours) || 0
    const end = Number(r.check_in_engine_hours ?? r.check_out_engine_hours) || 0
    const delta = Math.max(0, end - start)
    const key = r.equipment_id as string
    byEquip[key] = byEquip[key] || { totalDelta: 0, count: 0 }
    byEquip[key].totalDelta += delta
    byEquip[key].count += 1
  }

  const usage: UsageAnalytics[] = (equipment || []).map((e: any) => {
    const agg = byEquip[e.id] || { totalDelta: 0, count: 0 }
    const totalHours = Math.round(agg.totalDelta)
    const idleHours = Math.round(totalHours * 0.15)
    const utilizationRate = totalHours > 0 ? Math.round(((totalHours - idleHours) / Math.max(1, totalHours)) * 100) : 0
    const fuelEfficiency = 3 + (Math.random() - 0.5) // placeholder
    const maintenanceScore = 100 - Math.round((Number(e.engine_hours) || 0) / 80)
    return {
      equipmentId: e.equipment_id,
      totalHours,
      idleHours,
      fuelEfficiency: Number(fuelEfficiency.toFixed(1)),
      utilizationRate,
      maintenanceScore: Math.max(0, Math.min(100, maintenanceScore)),
    }
  })

  return NextResponse.json({ usage })
}


