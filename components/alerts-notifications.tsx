"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Wrench,
  Bell,
  BellOff,
  Search,
  Filter,
  Settings,
  Eye,
  X,
  AlertCircle,
  Info,
} from "./icons"
import { dataManager } from "../lib/dataManager"
import type { Alert } from "../types"

const severityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  critical: "bg-red-100 text-red-800 border-red-200",
}

const severityIcons = {
  low: Info,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: AlertTriangle,
}

const alertTypeIcons = {
  overdue: Clock,
  maintenance: Wrench,
  fuel_low: Fuel,
  idle_time: Clock,
  anomaly: AlertTriangle,
}

export function AlertsNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showAcknowledged, setShowAcknowledged] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)

  // Load alerts on component mount
  useEffect(() => {
    const allAlerts = dataManager.getAllAlerts()
    setAlerts(allAlerts)
  }, [])

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts occasionally
      if (Math.random() < 0.1) {
        // 10% chance every 5 seconds
        const newAlert: Alert = {
          id: `ALT${Date.now()}`,
          type: ["overdue", "maintenance", "fuel_low", "idle_time", "anomaly"][
            Math.floor(Math.random() * 5)
          ] as Alert["type"],
          equipmentId: `EQU100${Math.floor(Math.random() * 6) + 1}`,
          message: "Simulated real-time alert",
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as Alert["severity"],
          timestamp: new Date().toISOString(),
          acknowledged: false,
        }

        setAlerts((prev) => [newAlert, ...prev])

        if (notificationsEnabled) {
          // Show browser notification if supported
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Equipment Alert", {
              body: newAlert.message,
              icon: "/favicon.ico",
            })
          }
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [notificationsEnabled])

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || alert.severity === severityFilter
    const matchesType = typeFilter === "all" || alert.type === typeFilter
    const matchesAcknowledged = showAcknowledged || !alert.acknowledged

    return matchesSearch && matchesSeverity && matchesType && matchesAcknowledged
  })

  const handleAcknowledgeAlert = (alertId: string) => {
    dataManager.acknowledgeAlert(alertId)
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const unacknowledgedCount = alerts.filter((alert) => !alert.acknowledged).length
  const criticalCount = alerts.filter((alert) => alert.severity === "critical" && !alert.acknowledged).length

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setNotificationsEnabled(true)
      }
    }
  }

  const alertTypeCounts = alerts.reduce(
    (acc, alert) => {
      if (!alert.acknowledged) {
        acc[alert.type] = (acc[alert.type] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">{unacknowledgedCount} unacknowledged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Equipment</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertTypeCounts.overdue || 0}</div>
            <p className="text-xs text-muted-foreground">Past return date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertTypeCounts.maintenance || 0}</div>
            <p className="text-xs text-muted-foreground">Service required</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Notification Settings</span>
            <div className="flex items-center space-x-2">
              {notificationsEnabled ? (
                <Bell className="w-4 h-4 text-green-500" />
              ) : (
                <BellOff className="w-4 h-4 text-gray-400" />
              )}
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={(checked) => {
                  if (checked && "Notification" in window && Notification.permission !== "granted") {
                    requestNotificationPermission()
                  } else {
                    setNotificationsEnabled(checked)
                  }
                }}
              />
            </div>
          </CardTitle>
          <CardDescription>Configure how you receive alert notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch id="sms-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" checked={notificationsEnabled} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Alert Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by severity" />
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
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="fuel_low">Fuel Low</SelectItem>
                <SelectItem value="idle_time">Idle Time</SelectItem>
                <SelectItem value="anomaly">Anomaly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch id="show-acknowledged" checked={showAcknowledged} onCheckedChange={setShowAcknowledged} />
              <Label htmlFor="show-acknowledged" className="text-sm">
                Show acknowledged
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts ({filteredAlerts.length})</CardTitle>
          <CardDescription>Monitor and manage system alerts and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const SeverityIcon = severityIcons[alert.severity]
              const TypeIcon = alertTypeIcons[alert.type]

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${alert.acknowledged ? "bg-gray-50 opacity-75" : "bg-white"} ${
                    alert.severity === "critical"
                      ? "border-red-200"
                      : alert.severity === "high"
                        ? "border-orange-200"
                        : alert.severity === "medium"
                          ? "border-yellow-200"
                          : "border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-red-100"
                            : alert.severity === "high"
                              ? "bg-orange-100"
                              : alert.severity === "medium"
                                ? "bg-yellow-100"
                                : "bg-blue-100"
                        }`}
                      >
                        <TypeIcon
                          className={`w-4 h-4 ${
                            alert.severity === "critical"
                              ? "text-red-600"
                              : alert.severity === "high"
                                ? "text-orange-600"
                                : alert.severity === "medium"
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={severityColors[alert.severity]}>{alert.severity.toUpperCase()}</Badge>
                          <Badge variant="outline">{alert.type.replace("_", " ").toUpperCase()}</Badge>
                          <span className="text-sm text-muted-foreground">{alert.equipmentId}</span>
                        </div>
                        <p className="text-sm font-medium mb-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {alert.acknowledged && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledged
                        </Badge>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAlert(alert)}>
                            <Eye className="w-3 h-3 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Alert Details</DialogTitle>
                            <DialogDescription>Detailed information about this alert</DialogDescription>
                          </DialogHeader>
                          {selectedAlert && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Alert ID</Label>
                                  <p className="text-sm">{selectedAlert.id}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Equipment ID</Label>
                                  <p className="text-sm">{selectedAlert.equipmentId}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <p className="text-sm capitalize">{selectedAlert.type.replace("_", " ")}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Severity</Label>
                                  <Badge className={severityColors[selectedAlert.severity]}>
                                    {selectedAlert.severity}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Message</Label>
                                <p className="text-sm mt-1">{selectedAlert.message}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Timestamp</Label>
                                <p className="text-sm">{new Date(selectedAlert.timestamp).toLocaleString()}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <p className="text-sm">{selectedAlert.acknowledged ? "Acknowledged" : "Pending"}</p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {!alert.acknowledged && (
                        <Button variant="outline" size="sm" onClick={() => handleAcknowledgeAlert(alert.id)}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}

                      <Button variant="outline" size="sm" onClick={() => handleDismissAlert(alert.id)}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium">No alerts found</p>
                <p className="text-muted-foreground">
                  {searchTerm || severityFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "All systems are running smoothly"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Bulk operations and alert management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged)
                unacknowledgedAlerts.forEach((alert) => handleAcknowledgeAlert(alert.id))
              }}
              disabled={unacknowledgedCount === 0}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Acknowledge All ({unacknowledgedCount})
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const acknowledgedAlerts = alerts.filter((a) => a.acknowledged)
                acknowledgedAlerts.forEach((alert) => handleDismissAlert(alert.id))
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Acknowledged
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Alert Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}