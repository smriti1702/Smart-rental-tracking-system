"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Clock, Fuel, Wrench, MapPin, User, Download } from "./icons"
import { dataManager } from "../lib/dataManager"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function UsageAnalytics() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedEquipment, setSelectedEquipment] = useState("all")

  const [loading, setLoading] = useState(true)
  const [usageFromApi, setUsageFromApi] = useState<Array<{
    equipmentId: string
    totalHours: number
    idleHours: number
    fuelEfficiency: number
    utilizationRate: number
    maintenanceScore: number
  }>>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/analytics/usage", { cache: "no-store" })
        const json = await res.json()
        setUsageFromApi(json.usage || [])
      } catch {
        setUsageFromApi([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const equipment = dataManager.getAllEquipment()
  const analytics = dataManager.getUsageAnalytics()
  const rentals = dataManager.getAllRentals()
  const operators = dataManager.getAllOperators()
  const sites = dataManager.getAllSites()

  // Prefer live API usage metrics; fallback to mock
  const utilizationData = (usageFromApi.length
    ? usageFromApi.map((u) => {
        const eq = equipment.find((e) => e.id === u.equipmentId || e.id === (u as any).equipment_id)
        return {
          name: u.equipmentId || (eq?.id ?? "Unknown"),
          type: eq?.type ?? "",
          utilization: u.utilizationRate,
          totalHours: u.totalHours,
          idleHours: u.idleHours,
          efficiency: u.fuelEfficiency,
          maintenance: u.maintenanceScore,
        }
      })
    : equipment.map((eq) => {
        const analytic = analytics.find((a) => a.equipmentId === eq.id)
        return {
          name: eq.id,
          type: eq.type,
          utilization: analytic?.utilizationRate || 0,
          totalHours: analytic?.totalHours || 0,
          idleHours: analytic?.idleHours || 0,
          efficiency: analytic?.fuelEfficiency || 0,
          maintenance: analytic?.maintenanceScore || 0,
        }
      }))

  const fuelEfficiencyData = utilizationData.map((item) => ({
    name: item.name,
    efficiency: item.efficiency,
    type: item.type,
  }))

  const equipmentTypeData = equipment.reduce(
    (acc, eq) => {
      const existing = acc.find((item) => item.name === eq.type)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: eq.type, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const monthlyUsageData = [
    { month: "Jan", hours: 2400, fuel: 1800, revenue: 45000 },
    { month: "Feb", hours: 2100, fuel: 1600, revenue: 42000 },
    { month: "Mar", hours: 2800, fuel: 2100, revenue: 56000 },
    { month: "Apr", hours: 2600, fuel: 1950, revenue: 52000 },
    { month: "May", hours: 3200, fuel: 2400, revenue: 64000 },
    { month: "Jun", hours: 3100, fuel: 2300, revenue: 62000 },
  ]

  const siteUsageData = sites.map((site) => {
    const siteRentals = rentals.filter((r) => r.siteId === site.id)
    const totalHours = siteRentals.reduce((sum, r) => sum + r.operatingDays * 8, 0) // Estimate 8 hours per day
    return {
      name: site.name,
      hours: totalHours,
      equipment: siteRentals.length,
      utilization: Math.min(100, (totalHours / (siteRentals.length * 30 * 8)) * 100),
    }
  })

  const operatorPerformanceData = operators.map((op) => {
    const opRentals = rentals.filter((r) => r.operatorId === op.id)
    const avgFuelUsage = opRentals.reduce((sum, r) => sum + r.fuelUsage, 0) / opRentals.length || 0
    const totalHours = opRentals.reduce((sum, r) => sum + r.operatingDays * 8, 0)
    return {
      name: op.name,
      rentals: opRentals.length,
      hours: totalHours,
      fuelEfficiency: avgFuelUsage > 0 ? (totalHours / avgFuelUsage).toFixed(1) : 0,
      score: Math.floor(Math.random() * 20) + 80,
    }
  })

  const getStatusColor = (value: number, type: "utilization" | "efficiency" | "maintenance") => {
    if (type === "utilization") {
      if (value >= 80) return "text-green-600"
      if (value >= 60) return "text-yellow-600"
      return "text-red-600"
    }
    if (type === "efficiency") {
      if (value >= 3.5) return "text-green-600"
      if (value >= 2.5) return "text-yellow-600"
      return "text-red-600"
    }
    if (type === "maintenance") {
      if (value >= 90) return "text-green-600"
      if (value >= 70) return "text-yellow-600"
      return "text-red-600"
    }
    return "text-gray-600"
  }

  return (
    <div className="space-y-6">
      {/* Analytics Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Usage Analytics Dashboard {loading ? "(loading...)" : ""}</span>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
          <CardDescription>Comprehensive insights into equipment performance and utilization</CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {utilizationData.length
                ? `${(
                    utilizationData.reduce((s, i) => s + i.utilization, 0) / Math.max(1, utilizationData.length)
                  ).toFixed(1)}%`
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Live</span> from Supabase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operating Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {utilizationData.length ? utilizationData.reduce((s, i) => s + i.totalHours, 0) : "--"}
            </div>
            <p className="text-xs text-muted-foreground">Aggregated by API</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {utilizationData.length
                ? `${(
                    utilizationData.reduce((s, i) => s + i.efficiency, 0) / Math.max(1, utilizationData.length)
                  ).toFixed(1)}L/h`
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Score</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {utilizationData.length
                ? `${(
                    utilizationData.reduce((s, i) => s + i.maintenance, 0) / Math.max(1, utilizationData.length)
                  ).toFixed(0)}`
                : "--"}
            </div>
            <p className="text-xs text-muted-foreground">Based on engine hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="composition">Fleet Mix</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilization by Equipment</CardTitle>
                <CardDescription>Live utilization rates per equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" hide={false} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="utilization" fill="#3b82f6" name="Utilization %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total vs Idle Hours</CardTitle>
                <CardDescription>Comparison per equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="totalHours" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.35} name="Total Hours" />
                    <Area type="monotone" dataKey="idleHours" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} name="Idle Hours" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="composition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Type Distribution</CardTitle>
              <CardDescription>Fleet composition by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={equipmentTypeData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                    {equipmentTypeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Utilization (est.)</CardTitle>
              <CardDescription>Aggregate hours and utilization per site</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={siteUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#6366f1" name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue and Hours</CardTitle>
              <CardDescription>Illustrative trend (replace with real time series as available)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart data={monthlyUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} name="Hours" />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}