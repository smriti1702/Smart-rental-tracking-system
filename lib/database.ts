import { createClient } from "@/lib/supabase/server"
import type { Equipment, Rental, Site, Operator, Alert, MaintenanceRecord } from "@/types"

export async function getEquipment(): Promise<Equipment[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("equipment").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching equipment:", error)
    return []
  }

  return data || []
}

export async function getRentals(): Promise<Rental[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("rentals")
    .select(`
      *,
      equipment:equipment_id(*),
      site:site_id(*),
      operator:operator_id(*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching rentals:", error)
    return []
  }

  return data || []
}

export async function getSites(): Promise<Site[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("sites").select("*").order("name")

  if (error) {
    console.error("Error fetching sites:", error)
    return []
  }

  return data || []
}

export async function getOperators(): Promise<Operator[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("operators").select("*").order("name")

  if (error) {
    console.error("Error fetching operators:", error)
    return []
  }

  return data || []
}

export async function getAlerts(): Promise<Alert[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("alerts")
    .select(`
      *,
      equipment:equipment_id(*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching alerts:", error)
    return []
  }

  return data || []
}

export async function getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("maintenance_records")
    .select(`
      *,
      equipment:equipment_id(*)
    `)
    .order("maintenance_date", { ascending: false })

  if (error) {
    console.error("Error fetching maintenance records:", error)
    return []
  }

  return data || []
}

// Server actions for CRUD operations
export async function createRental(rental: Partial<Rental>) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("rentals").insert(rental).select().single()

  if (error) {
    throw new Error(`Failed to create rental: ${error.message}`)
  }

  // Update equipment status
  if (rental.equipmentId) {
    await supabase.from("equipment").update({ status: "rented" }).eq("id", rental.equipmentId)
  }

  return data
}

export async function updateRental(id: string, updates: Partial<Rental>) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("rentals").update(updates).eq("id", id).select().single()

  if (error) {
    throw new Error(`Failed to update rental: ${error.message}`)
  }

  return data
}

export async function checkInEquipment(
  rentalId: string,
  checkInData: {
    actual_return_date: string
    check_in_engine_hours: number
    check_in_fuel_level: number
    notes?: string
  },
) {
  const supabase = await createClient()

  // Update rental record
  const { data: rental, error: rentalError } = await supabase
    .from("rentals")
    .update({
      ...checkInData,
      status: "completed",
    })
    .eq("id", rentalId)
    .select("equipment_id")
    .single()

  if (rentalError) {
    throw new Error(`Failed to check in equipment: ${rentalError.message}`)
  }

  // Update equipment status and hours
  if (rental?.equipment_id) {
    await supabase
      .from("equipment")
      .update({
        status: "available",
        engine_hours: checkInData.check_in_engine_hours,
        fuel_level: checkInData.check_in_fuel_level,
      })
      .eq("id", rental.equipment_id)
  }

  return rental
}

export async function acknowledgeAlert(alertId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("alerts")
    .update({
      status: "acknowledged",
      acknowledged_at: new Date().toISOString(),
    })
    .eq("id", alertId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to acknowledge alert: ${error.message}`)
  }

  return data
}
