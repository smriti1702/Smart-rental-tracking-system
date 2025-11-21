export type UUID = string

export type EquipmentStatus = "available" | "rented" | "maintenance" | "overdue"

export interface GeoLocation {
  lat: number
  lng: number
  address?: string
}

export interface EquipmentSpecifications {
  engineHours: number
  fuelCapacity: number
  operatingWeight: number
  capacity?: number
}

export interface Equipment {
  id: string
  type: string
  model: string
  serialNumber?: string
  manufacturer?: string
  year?: number
  status: EquipmentStatus
  location: GeoLocation
  specifications: EquipmentSpecifications
  hourlyRate?: number
  siteId?: string
}

export interface Site {
  id: string
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  projectManager?: string
  activeEquipment?: number
}

export interface Operator {
  id: string
  name: string
  email?: string
  phone?: string
  licenseNumber?: string
  certifications?: string[]
  activeRentals?: number
}

export type RentalStatus = "active" | "completed" | "overdue" | "cancelled"

export interface Rental {
  id: string
  equipmentId: string
  operatorId: string
  siteId: string
  projectId?: string
  checkOutDate: string
  checkInDate: string | null
  plannedReturnDate: string
  engineHoursStart: number
  engineHoursEnd: number | null
  fuelUsage: number
  operatingDays: number
  status: RentalStatus
  qrCode?: string
  totalCost?: number
  duration?: number
  utilizationRate?: number
}

export type AlertSeverity = "low" | "medium" | "high" | "critical"
export type AlertType =
  | "overdue"
  | "maintenance"
  | "idle_time"
  | "fuel_low"
  | "anomaly"
  | "ghost_asset"
  | "under_utilized"

export interface Alert {
  id: string
  type: AlertType
  equipmentId: string
  message: string
  severity: AlertSeverity
  timestamp: string
  acknowledged: boolean
}

export interface UsageAnalytics {
  equipmentId: string
  totalHours: number
  idleHours: number
  fuelEfficiency: number
  utilizationRate: number
  maintenanceScore: number
  timestamp?: string
}

export interface MaintenanceRecord {
  id: string
  equipmentId: string
  maintenanceDate: string
  maintenanceType: string
  description?: string
  cost?: number
  performedBy?: string
  nextMaintenanceDue?: string
}

export interface DemandForecastItem {
  equipmentType: string
  predictedDemand: number
  confidence: number
}

export interface AvailabilitySnapshot {
  equipmentId: string
  status: EquipmentStatus
  location: GeoLocation
  timestamp: string
}

export interface CarbonEstimate {
  equipmentId: string
  periodHours: number
  estimatedCO2kg: number
}

export interface AnomalyDetectionResult {
  equipmentId: string
  anomalyType: string
  severity: AlertSeverity
  score: number
  description: string
  algorithm?: string
  confidence?: number
}

export interface VoiceIntent {
  intent: string
  language: string
  confidence: number
  entities: Record<string, string | number>
}

// New types for enhanced ML models
export interface Project {
  id: string
  name: string
  type: string
  siteId: string
  startDate: string
  duration: number
  budget: number
  requiredCapacity: number
  priority: number
  equipmentRequirements?: Array<{
    equipmentId: string
    requiredHours: number
  }>
}

export interface WeatherData {
  date: string
  temperature: number
  humidity: number
  precipitation: number
  windSpeed: number
  visibility: number
  conditions: "clear" | "cloudy" | "rain" | "snow" | "storm" | "fog" | "extreme_heat" | "extreme_cold"
}

export interface EquipmentRecommendation {
  equipmentId: string
  equipmentType: string
  siteId: string
  score: number
  confidence: number
  reasons: string[]
  estimatedCost: number
  availability: string
  suitability: "excellent" | "good" | "fair" | "poor"
}

export interface OptimizationResult {
  totalCost: number
  costSavings: number
  savingsPercentage: number
  recommendations: Array<{
    type: string
    description: string
    estimatedSavings: number
    implementationDifficulty: "easy" | "medium" | "hard"
    priority: "high" | "medium" | "low"
  }>
  equipmentAllocation: Array<{
    equipmentId: string
    projectId: string
    startDate: string
    endDate: string
    utilization: number
    cost: number
    efficiency: number
  }>
  constraints: {
    budget: number
    timeline: number
    equipmentAvailability: boolean
    maintenanceWindows: boolean
    transportationLimits: boolean
  }
}


