"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
} from "recharts"
import { AlertTriangle, TrendingUp, Clock, MapPin, Wrench, Fuel, Search, Eye } from "./icons"
import type { Equipment, Rental } from "../types"
import { getEquipment, getRentals } from "../lib/dataManager"

interface Anomaly {
  id: string
  equipmentId: string
  equipmentName: string
  type: "idle_time" | "fuel_efficiency" | "unassigned" | "overuse" | "location" | "maintenance"
  severity: "low" | "medium" | "high" | "critical"
  score: number
  description: string
  detectedAt: Date
  status: "new" | "investigating" | "resolved" | "false_positive"
  impact: string
  recommendation: string
  historicalPattern?: any[]
}

const Progress = ({ value, className }: { value: number; className?: string }) => {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full bg-gray-200 rounded ${className || "h-3"}`}>
      <div className="bg-blue-500 h-full rounded" style={{ width: `${clamped}%` }} />
    </div>
  )
}

// Default anomaly that should always be visible on the page
const DEFAULT_ANOMALY: Anomaly = {
  id: "default-always-visible",
  equipmentId: "default",
  equipmentName: "System Monitor",
  type: "maintenance",
  severity: "low",
  score: 15,
  description: "Baseline check: Monitoring active. This sample anomaly is always visible.",
  detectedAt: new Date(),
  status: "new",
  impact: "No operational impact. Serves as an example and health check.",
  recommendation: "Use filters and actions to explore anomaly workflows.",
}

const generateAnomalies = (equipment: Equipment[], rentals: Rental[]): Anomaly[] => {
  const anomalies: Anomaly[] = []

  equipment.forEach((eq) => {
    const equipmentRentals = rentals.filter((r) => r.equipmentId === eq.id)
    const recentRental = equipmentRentals[0]

    // Idle time anomaly
    if (eq.status === "rented" && recentRental && recentRental.operatingDays > 20) {
      anomalies.push({
        id: `idle-${eq.id}`,
        equipmentId: eq.id,
        equipmentName: `${eq.type} ${eq.model}`,
        type: "idle_time",
        severity: recentRental.operatingDays > 40 ? "critical" : "high",
        score: Math.min(100, (recentRental.operatingDays / 50) * 100),
        description: `High inactive days detected: ${recentRental.operatingDays} days`,
        detectedAt: new Date(),
        status: "new",
        impact: `Estimated cost impact: $${(recentRental.operatingDays * 25).toFixed(0)}`,
        recommendation: "Investigate operator training or reassign equipment",
        historicalPattern: Array.from({ length: 7 }, (_, i) => ({
          day: i + 1,
          idleHours: Math.random() * 30 + 10,
        })),
      })
    }

    // Fuel efficiency anomaly
    if (recentRental && recentRental.fuelUsage > 0 && recentRental.engineHoursEnd && recentRental.engineHoursStart >= 0) {
      const engineHours = Math.max(1, (recentRental.engineHoursEnd ?? 0) - recentRental.engineHoursStart)
      const fuelEfficiency = recentRental.fuelUsage / engineHours
      if (fuelEfficiency > 8) {
        // Assuming normal is 5-7 gallons/hour
        anomalies.push({
          id: `fuel-${eq.id}`,
          equipmentId: eq.id,
          equipmentName: `${eq.type} ${eq.model}`,
          type: "fuel_efficiency",
          severity: fuelEfficiency > 12 ? "critical" : "medium",
          score: Math.min(100, ((fuelEfficiency - 5) / 10) * 100),
          description: `Poor fuel efficiency: ${fuelEfficiency.toFixed(1)} gal/hr`,
          detectedAt: new Date(),
          status: "new",
          impact: `Extra fuel cost: $${((fuelEfficiency - 6) * engineHours * 3.5).toFixed(0)}`,
          recommendation: "Schedule maintenance check or operator retraining",
        })
      }
    }

    // Unassigned equipment
    if (eq.status === "available" && Math.random() > 0.7) {
      const daysSinceLastUse = Math.floor(Math.random() * 30) + 15
      anomalies.push({
        id: `unassigned-${eq.id}`,
        equipmentId: eq.id,
        equipmentName: `${eq.type} ${eq.model}`,
        type: "unassigned",
        severity: daysSinceLastUse > 30 ? "high" : "medium",
        score: Math.min(100, (daysSinceLastUse / 45) * 100),
        description: `Equipment unused for ${daysSinceLastUse} days`,
        detectedAt: new Date(),
        status: "new",
        impact: `Lost revenue opportunity: $${(daysSinceLastUse * 150).toFixed(0)}`,
        recommendation: "Consider relocating to high-demand site or promotional pricing",
      })
    }

    // Overuse anomaly
    if (recentRental && (recentRental.engineHoursEnd ?? 0) - recentRental.engineHoursStart > 200) {
      const engineHours = (recentRental.engineHoursEnd ?? 0) - recentRental.engineHoursStart
      anomalies.push({
        id: `overuse-${eq.id}`,
        equipmentId: eq.id,
        equipmentName: `${eq.type} ${eq.model}`,
        type: "overuse",
        severity: engineHours > 300 ? "critical" : "high",
        score: Math.min(100, (engineHours / 400) * 100),
        description: `Excessive usage: ${engineHours} hours this period`,
        detectedAt: new Date(),
        status: "new",
        impact: "Accelerated wear and maintenance needs",
        recommendation: "Schedule immediate maintenance inspection",
      })
    }
  })

  return anomalies.slice(0, 12) // Limit for demo
}

export default function AnomalyDetection() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [filteredAnomalies, setFilteredAnomalies] = useState<Anomaly[]>([])
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const equipment = await getEquipment()
      const rentals = await getRentals()
      const detectedAnomalies = generateAnomalies(equipment, rentals)
      const combined = [DEFAULT_ANOMALY, ...detectedAnomalies]
      setAnomalies(combined)
      setFilteredAnomalies(combined)
      setLoading(false)
    }

    loadData()

    // Simulate real-time anomaly detection
    const interval = setInterval(() => {
      setAnomalies((prev) => {
        const updated = prev.map((a) => ({
          ...a,
          score: Math.max(0, a.score + (Math.random() - 0.5) * 10),
        }))
        return updated
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = anomalies

    if (searchTerm) {
      filtered = filtered.filter(
        (a) =>
          a.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((a) => a.severity === severityFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((a) => a.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter)
    }

    // Ensure the default anomaly is always visible regardless of filters
    if (!filtered.some((a) => a.id === DEFAULT_ANOMALY.id)) {
      filtered = [DEFAULT_ANOMALY, ...filtered]
    }

    setFilteredAnomalies(filtered)
  }, [anomalies, searchTerm, severityFilter, typeFilter, statusFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "idle_time":
        return <Clock className="h-4 w-4" />
      case "fuel_efficiency":
        return <Fuel className="h-4 w-4" />
      case "unassigned":
        return <MapPin className="h-4 w-4" />
      case "overuse":
        return <TrendingUp className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const updateAnomalyStatus = (anomalyId: string, newStatus: Anomaly["status"]) => {
    setAnomalies((prev) => prev.map((a) => (a.id === anomalyId ? { ...a, status: newStatus } : a)))
  }

  const anomalyStats = {
    total: anomalies.length,
    critical: anomalies.filter((a) => a.severity === "critical").length,
    high: anomalies.filter((a) => a.severity === "high").length,
    new: anomalies.filter((a) => a.status === "new").length,
    avgScore: anomalies.reduce((sum, a) => sum + a.score, 0) / anomalies.length || 0,
  }

  const anomalyTrends = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${i + 1}`,
    anomalies: Math.floor(Math.random() * 15) + 5,
    resolved: Math.floor(Math.random() * 10) + 2,
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analyzing equipment patterns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Anomalies</p>
                <p className="text-2xl font-bold">{anomalyStats.total}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{anomalyStats.critical}</p>
              </div>
              <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{anomalyStats.new}</p>
              </div>
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                <p className="text-2xl font-bold">{anomalyStats.avgScore.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analysis">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="settings">Detection Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection Dashboard</CardTitle>
              <CardDescription>AI-powered detection of equipment misuse and operational inefficiencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search anomalies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="idle_time">Idle Time</SelectItem>
                    <SelectItem value="fuel_efficiency">Fuel Efficiency</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="overuse">Overuse</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="investigating">Investigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Anomalies List */}
              <div className="space-y-4">
                {filteredAnomalies.map((anomaly) => (
                  <Card
                    key={anomaly.id}
                    className={`border-l-4 ${getSeverityColor(anomaly.severity)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">{getTypeIcon(anomaly.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{anomaly.equipmentName}</h4>
                              <Badge variant="outline" className={`${getSeverityColor(anomaly.severity)} text-white`}>
                                {anomaly.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="secondary">{anomaly.type.replace("_", " ").toUpperCase()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{anomaly.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>Risk Score: {anomaly.score.toFixed(0)}/100</span>
                              <span>Detected: {anomaly.detectedAt.toLocaleDateString()}</span>
                              <span className="capitalize">Status: {anomaly.status.replace("_", " ")}</span>
                            </div>
                            <div className="mt-2">
                              <Progress value={anomaly.score} className="h-2" />
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedAnomaly(anomaly)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          {anomaly.status === "new" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAnomalyStatus(anomaly.id, "investigating")}
                            >
                              Investigate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Trends</CardTitle>
                <CardDescription>Daily anomaly detection and resolution patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={anomalyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={2} name="Detected" />
                    <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Score Distribution</CardTitle>
                <CardDescription>Equipment risk scores across the fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <ScatterChart data={anomalies.map((a) => ({ name: a.equipmentName, score: a.score }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide />
                    <YAxis dataKey="score" />
                    <Tooltip />
                    <Scatter dataKey="score" fill="#3b82f6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Types</CardTitle>
                <CardDescription>Distribution of detected anomaly categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={[
                      { type: "Idle Time", count: anomalies.filter((a) => a.type === "idle_time").length },
                      { type: "Fuel Efficiency", count: anomalies.filter((a) => a.type === "fuel_efficiency").length },
                      { type: "Unassigned", count: anomalies.filter((a) => a.type === "unassigned").length },
                      { type: "Overuse", count: anomalies.filter((a) => a.type === "overuse").length },
                      { type: "Maintenance", count: anomalies.filter((a) => a.type === "maintenance").length },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>Machine learning recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 p-3 border rounded">
                  <TrendingUp className="h-4 w-4" />
                  <div className="text-sm">
                    <strong>Pattern Detected:</strong> Excavators show 40% higher idle time on Fridays. Consider
                    scheduling maintenance on low-activity days.
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border rounded">
                  <Fuel className="h-4 w-4" />
                  <div className="text-sm">
                    <strong>Efficiency Alert:</strong> Site B equipment shows 25% worse fuel efficiency. Recommend
                    operator training program.
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border rounded">
                  <MapPin className="h-4 w-4" />
                  <div className="text-sm">
                    <strong>Optimization:</strong> 3 bulldozers have been idle for 20+ days. Consider relocating to Site
                    C where demand is high.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detection Thresholds</CardTitle>
              <CardDescription>Configure anomaly detection sensitivity and rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Idle Time Thresholds</h4>
                  <div className="space-y-2">
                    <label className="text-sm">Medium Alert (hours)</label>
                    <Input type="number" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">High Alert (hours)</label>
                    <Input type="number" defaultValue="40" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Fuel Efficiency</h4>
                  <div className="space-y-2">
                    <label className="text-sm">Poor Efficiency (gal/hr)</label>
                    <Input type="number" defaultValue="8" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Critical Efficiency (gal/hr)</label>
                    <Input type="number" defaultValue="12" step="0.1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Usage Limits</h4>
                  <div className="space-y-2">
                    <label className="text-sm">High Usage (hours/period)</label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Overuse Alert (hours/period)</label>
                    <Input type="number" defaultValue="300" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Unassigned Equipment</h4>
                  <div className="space-y-2">
                    <label className="text-sm">Alert After (days)</label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm">Critical After (days)</label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Anomaly Detail Modal */}
      {selectedAnomaly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {getTypeIcon(selectedAnomaly.type)}
                    <span>{selectedAnomaly.equipmentName}</span>
                    <Badge className={`${getSeverityColor(selectedAnomaly.severity)} text-white`}>
                      {selectedAnomaly.severity.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{selectedAnomaly.description}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setSelectedAnomaly(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Risk Score</p>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedAnomaly.score} className="flex-1" />
                    <span className="text-sm">{selectedAnomaly.score.toFixed(0)}/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="capitalize">{selectedAnomaly.status.replace("_", " ")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Impact Assessment</p>
                <p className="text-sm text-muted-foreground">{selectedAnomaly.impact}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Recommendation</p>
                <p className="text-sm text-muted-foreground">{selectedAnomaly.recommendation}</p>
              </div>

              {selectedAnomaly.historicalPattern && (
                <div>
                  <p className="text-sm font-medium mb-2">Historical Pattern</p>
                  <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                    History chart placeholder
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => updateAnomalyStatus(selectedAnomaly.id, "false_positive")}>
                  Mark False Positive
                </Button>
                <Button variant="outline" onClick={() => updateAnomalyStatus(selectedAnomaly.id, "investigating")}>
                  Start Investigation
                </Button>
                <Button onClick={() => updateAnomalyStatus(selectedAnomaly.id, "resolved")}>Mark Resolved</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}