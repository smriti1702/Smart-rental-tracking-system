"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, Wrench } from "../components/icons"
import { EquipmentDashboard } from "../components/equipment-dashboard"
import { CheckInSystem } from "../components/checkin-system"
import { UsageAnalytics } from "../components/usage-anlytics"
import { AlertsNotifications } from "../components/alerts-notifications"
import { DemandForecasting } from "../components/demand-forecasting"
import AnomalyDetection from "../components/anomaly-detection"
import EquipmentSharing from "../components/equipment-sharing"
import GhostAssets from "../components/ghost-assets"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">CATlease</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">75% utilization rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
              <Wrench className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$127,500</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="checkin">Check In/Out</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="sharing">Equipment Sharing</TabsTrigger>
            <TabsTrigger value="ghost">Ghost Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest equipment movements and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Excavator 320D checked out</p>
                      <p className="text-xs text-muted-foreground">Manhattan Tower Project • 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bulldozer D6N maintenance completed</p>
                      <p className="text-xs text-muted-foreground">Equipment Yard • 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Crane M318F overdue alert</p>
                      <p className="text-xs text-muted-foreground">Bronx Development Site • 6 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Active Alerts</span>
                  </CardTitle>
                  <CardDescription>Issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-red-800">Equipment Overdue</p>
                      <p className="text-xs text-red-600">EQU1004 - 9 days overdue</p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Maintenance Due</p>
                      <p className="text-xs text-yellow-600">Grader 140M - 5000+ hours</p>
                    </div>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Idle Equipment</p>
                      <p className="text-xs text-blue-600">EQU1001 - 6+ hours idle</p>
                    </div>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Equipment Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status Overview</CardTitle>
                <CardDescription>Current status of all equipment in the fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-lg font-semibold text-green-800">12</p>
                      <p className="text-sm text-green-600">Available</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-lg font-semibold text-blue-800">8</p>
                      <p className="text-sm text-blue-600">Rented</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <Wrench className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-lg font-semibold text-yellow-800">2</p>
                      <p className="text-sm text-yellow-600">Maintenance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentDashboard />
          </TabsContent>

          <TabsContent value="checkin">
            <CheckInSystem />
          </TabsContent>

          <TabsContent value="analytics">
            <UsageAnalytics />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsNotifications />
          </TabsContent>

          <TabsContent value="forecasting">
            <DemandForecasting />
          </TabsContent>

          <TabsContent value="anomaly">
            <AnomalyDetection />
          </TabsContent>

          <TabsContent value="sharing">
            <EquipmentSharing />
          </TabsContent>

          <TabsContent value="ghost">
            <GhostAssets />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
