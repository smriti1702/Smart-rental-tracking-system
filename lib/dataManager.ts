import type { Equipment, Rental, Operator, Site, Alert, UsageAnalytics } from "@/types"
import { mockEquipment, mockRentals, mockOperators, mockSites, mockAlerts, mockUsageAnalytics } from "./mockData"
import { createClient } from "@/lib/supabase/client"

// Simulate real-time data updates
class DataManager {
  private equipment: Equipment[] = [...mockEquipment]
  private rentals: Rental[] = [...mockRentals]
  private operators: Operator[] = [...mockOperators]
  private sites: Site[] = [...mockSites]
  private alerts: Alert[] = [...mockAlerts]
  private analytics: UsageAnalytics[] = [...mockUsageAnalytics]

  // Equipment methods
  getAllEquipment(): Equipment[] {
    return this.equipment
  }

  getEquipmentById(id: string): Equipment | undefined {
    return this.equipment.find((eq) => eq.id === id)
  }

  updateEquipmentStatus(id: string, status: Equipment["status"]): void {
    const equipment = this.equipment.find((eq) => eq.id === id)
    if (equipment) {
      equipment.status = status
    }
  }

  // Rental methods
  getAllRentals(): Rental[] {
    return this.rentals
  }

  getActiveRentals(): Rental[] {
    return this.rentals.filter((rental) => rental.status === "active")
  }

  getOverdueRentals(): Rental[] {
    return this.rentals.filter((rental) => rental.status === "overdue")
  }

  checkInEquipment(rentalId: string, engineHours: number): void {
    const rental = this.rentals.find((r) => r.id === rentalId)
    if (rental) {
      rental.checkInDate = new Date().toISOString().split("T")[0]
      rental.engineHoursEnd = engineHours
      rental.status = "completed"

      // Update equipment status
      this.updateEquipmentStatus(rental.equipmentId, "available")
    }
  }

  checkOutEquipment(equipmentId: string, operatorId: string, siteId: string, plannedReturnDate: string): string {
    const newRentalId = `REN${Date.now()}`
    const equipment = this.getEquipmentById(equipmentId)

    if (equipment) {
      const newRental: Rental = {
        id: newRentalId,
        equipmentId,
        operatorId,
        siteId,
        checkOutDate: new Date().toISOString().split("T")[0],
        checkInDate: null,
        plannedReturnDate,
        engineHoursStart: equipment.specifications.engineHours,
        engineHoursEnd: null,
        fuelUsage: 0,
        operatingDays: 0,
        status: "active",
        qrCode: `QR_${newRentalId}_${equipmentId}`,
      }

      this.rentals.push(newRental)
      this.updateEquipmentStatus(equipmentId, "rented")
    }

    return newRentalId
  }

  // Alert methods
  getAllAlerts(): Alert[] {
    return this.alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  getUnacknowledgedAlerts(): Alert[] {
    return this.alerts.filter((alert) => !alert.acknowledged)
  }

  acknowledgeAlert(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.acknowledged = true
    }
  }

  // Analytics methods
  getUsageAnalytics(): UsageAnalytics[] {
    return this.analytics
  }

  getEquipmentAnalytics(equipmentId: string): UsageAnalytics | undefined {
    return this.analytics.find((a) => a.equipmentId === equipmentId)
  }

  // Operators and Sites
  getAllOperators(): Operator[] {
    return this.operators
  }

  getAllSites(): Site[] {
    return this.sites
  }

  // Demand forecasting simulation
  getDemandForecast(): { equipmentType: string; predictedDemand: number; confidence: number }[] {
    return [
      { equipmentType: "Excavator", predictedDemand: 85, confidence: 92 },
      { equipmentType: "Bulldozer", predictedDemand: 67, confidence: 88 },
      { equipmentType: "Crane", predictedDemand: 45, confidence: 79 },
      { equipmentType: "Grader", predictedDemand: 34, confidence: 85 },
      { equipmentType: "Loader", predictedDemand: 56, confidence: 81 },
    ]
  }

  // Anomaly detection simulation
  getAnomalies(): { equipmentId: string; anomalyType: string; severity: string; description: string }[] {
    return [
      {
        equipmentId: "EQU1004",
        anomalyType: "Extended Idle Time",
        severity: "medium",
        description: "Equipment has been idle for 15+ hours over the past 3 days",
      },
      {
        equipmentId: "EQU1001",
        anomalyType: "Unusual Fuel Consumption",
        severity: "low",
        description: "Fuel consumption 15% higher than expected for current usage pattern",
      },
    ]
  }
}

export const dataManager = new DataManager()

export const getEquipment = () => dataManager.getAllEquipment()
export const getRentals = () => dataManager.getAllRentals()
export const getOperators = () => dataManager.getAllOperators()
export const getSites = () => dataManager.getAllSites()
export const getAlerts = () => dataManager.getAllAlerts()
export const getUsageAnalytics = () => dataManager.getUsageAnalytics()

// Equipment Sharing Functions
export async function getNearbyShareableEquipment(
  lat: number, 
  lon: number, 
  maxDistance: number = 50, 
  equipmentType?: string
) {
  try {
    const supabase = createClient();
    
    // Use the database function to find nearby equipment
    const { data, error } = await supabase.rpc('find_nearby_shareable_equipment', {
      site_lat: lat,
      site_lon: lon,
      max_distance_km: maxDistance,
      equipment_type: equipmentType || null
    });

    if (error) {
      console.error('Error fetching nearby equipment:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getNearbyShareableEquipment:', error);
    return [];
  }
}

export async function getSharingHistory(siteId: string) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('equipment_sharing')
      .select(`
        id,
        sharing_start_date,
        sharing_end_date,
        hourly_rate,
        total_hours,
        total_cost,
        status,
        distance_km,
        sharing_reason,
        equipment:equipment_id(equipment_id),
        owner_site:owner_site_id(site_id, name),
        borrower_site:borrower_site_id(site_id, name)
      `)
      .or(`owner_site_id.eq.${siteId},borrower_site_id.eq.${siteId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sharing history:', error);
      return [];
    }

    return data?.map(record => ({
      id: record.id,
      equipment_id: record.equipment?.equipment_id || '',
      owner_site_name: record.owner_site?.name || '',
      borrower_site_name: record.borrower_site?.name || '',
      sharing_start_date: record.sharing_start_date,
      sharing_end_date: record.sharing_end_date,
      hourly_rate: record.hourly_rate,
      total_hours: record.total_hours,
      total_cost: record.total_cost,
      status: record.status,
      distance_km: record.distance_km,
      sharing_reason: record.sharing_reason
    })) || [];
  } catch (error) {
    console.error('Error in getSharingHistory:', error);
    return [];
  }
}

export async function createSharingRequest(requestData: {
  equipment_id: string;
  borrower_site_id: string;
  sharing_start_date: string;
  sharing_end_date: string;
  hourly_rate: number;
  sharing_reason: string;
}) {
  try {
    const supabase = createClient();

    // Get equipment details and owner site
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select(`
        id,
        equipment_id,
        is_shareable,
        utilization_rate,
        status,
        owner_site_id,
        owner_site:owner_site_id(id, site_id, name, latitude, longitude)
      `)
      .eq('equipment_id', requestData.equipment_id)
      .single();

    if (equipmentError || !equipment) {
      throw new Error('Equipment not found');
    }

    // Validate equipment is shareable
    if (!equipment.is_shareable) {
      throw new Error('Equipment is not available for sharing');
    }

    // Validate equipment status
    if (equipment.status !== 'available') {
      throw new Error('Equipment is not currently available');
    }

    // Validate utilization rate
    if (equipment.utilization_rate >= 50) {
      throw new Error('Equipment utilization is too high for sharing');
    }

    // Get borrower site details
    const { data: borrowerSite, error: borrowerError } = await supabase
      .from('sites')
      .select('id, site_id, name, latitude, longitude')
      .eq('site_id', requestData.borrower_site_id)
      .single();

    if (borrowerError || !borrowerSite) {
      throw new Error('Borrower site not found');
    }

    // Calculate distance between sites
    const distance = calculateDistance(
      equipment.owner_site.latitude,
      equipment.owner_site.longitude,
      borrowerSite.latitude,
      borrowerSite.longitude
    );

    // Get sharing preferences for owner site
    const { data: preferences, error: preferencesError } = await supabase
      .from('sharing_preferences')
      .select('max_sharing_distance_km, auto_approve_sharing')
      .eq('site_id', equipment.owner_site_id)
      .single();

    // Check distance limit
    const maxDistance = preferences?.max_sharing_distance_km || 50;
    if (distance > maxDistance) {
      throw new Error(`Distance (${distance.toFixed(1)}km) exceeds maximum allowed distance (${maxDistance}km)`);
    }

    // Calculate total hours and cost
    const startDate = new Date(requestData.sharing_start_date);
    const endDate = new Date(requestData.sharing_end_date);
    const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const totalCost = totalHours * requestData.hourly_rate;

    // Determine status based on auto-approve setting
    const status = preferences?.auto_approve_sharing ? 'active' : 'pending';

    // Create sharing record
    const { data: sharingRecord, error: sharingError } = await supabase
      .from('equipment_sharing')
      .insert({
        equipment_id: equipment.id,
        owner_site_id: equipment.owner_site_id,
        borrower_site_id: borrowerSite.id,
        sharing_start_date: requestData.sharing_start_date,
        sharing_end_date: requestData.sharing_end_date,
        hourly_rate: requestData.hourly_rate,
        total_hours: totalHours,
        total_cost: totalCost,
        status: status,
        distance_km: distance,
        sharing_reason: requestData.sharing_reason
      })
      .select()
      .single();

    if (sharingError) {
      throw new Error('Failed to create sharing request');
    }

    // If auto-approved, update equipment status
    if (status === 'active') {
      await supabase
        .from('equipment')
        .update({ status: 'shared' })
        .eq('id', equipment.id);
    }

    return {
      success: true,
      sharing_id: sharingRecord.id,
      status: status,
      message: status === 'active' ? 'Sharing request approved automatically' : 'Sharing request submitted for approval'
    };

  } catch (error) {
    console.error('Error in createSharingRequest:', error);
    throw error;
  }
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function getSharingPreferences(siteId: string) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('sharing_preferences')
      .select('*')
      .eq('site_id', siteId)
      .single();

    if (error) {
      console.error('Error fetching sharing preferences:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSharingPreferences:', error);
    return null;
  }
}

export async function updateSharingPreferences(siteId: string, preferences: {
  max_sharing_distance_km?: number;
  min_utilization_threshold?: number;
  preferred_hourly_rate?: number;
  auto_approve_sharing?: boolean;
  equipment_types_shareable?: string[];
}) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('sharing_preferences')
      .upsert({
        site_id: siteId,
        ...preferences
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating sharing preferences:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSharingPreferences:', error);
    throw error;
  }
}

export async function getEquipmentUtilization(equipmentId: string, days: number = 30) {
  try {
    const supabase = createClient();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('equipment_utilization')
      .select('*')
      .eq('equipment_id', equipmentId)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching equipment utilization:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEquipmentUtilization:', error);
    return [];
  }
}
