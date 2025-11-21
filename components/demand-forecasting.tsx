"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog"
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, TrendingDown, Brain, MapPin, Calendar, Target, AlertCircle, CheckCircle } from "./icons"
import { dataManager } from "../lib/dataManager"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function DemandForecasting() {
  const [forecastPeriod, setForecastPeriod] = useState("30d")
  const [selectedEquipmentType, setSelectedEquipmentType] = useState("all")
  const [selectedSite, setSelectedSite] = useState("all")
  const [insightInModal, setInsightInModal] = useState<any | null>(null)
  const [implemented, setImplemented] = useState<Record<number, boolean>>({})

  const sites = dataManager.getAllSites()
  const equipment = dataManager.getAllEquipment()
  const demandForecast = dataManager.getDemandForecast()

  // Generate historical and forecasted demand data
  const historicalDemandData = [
    { month: "Jan", excavator: 12, bulldozer: 8, crane: 6, grader: 4, loader: 7, actual: true },
    { month: "Feb", excavator: 10, bulldozer: 9, crane: 5, grader: 3, loader: 6, actual: true },
    { month: "Mar", excavator: 15, bulldozer: 11, crane: 8, grader: 6, loader: 9, actual: true },
    { month: "Apr", excavator: 14, bulldozer: 10, crane: 7, grader: 5, loader: 8, actual: true },
    { month: "May", excavator: 18, bulldozer: 13, crane: 9, grader: 7, loader: 11, actual: true },
    { month: "Jun", excavator: 16, bulldozer: 12, crane: 8, grader: 6, loader: 10, actual: true },
  ]

  const forecastedDemandData = [
    { month: "Jul", excavator: 19, bulldozer: 14, crane: 10, grader: 8, loader: 12, actual: false, confidence: 92 },
    { month: "Aug", excavator: 21, bulldozer: 15, crane: 11, grader: 9, loader: 13, actual: false, confidence: 88 },
    { month: "Sep", excavator: 17, bulldozer: 13, crane: 9, grader: 7, loader: 11, actual: false, confidence: 85 },
    { month: "Oct", excavator: 16, bulldozer: 12, crane: 8, grader: 6, loader: 10, actual: false, confidence: 82 },
    { month: "Nov", excavator: 14, bulldozer: 10, crane: 7, grader: 5, loader: 8, actual: false, confidence: 79 },
    { month: "Dec", excavator: 13, bulldozer: 9, crane: 6, grader: 4, loader: 7, actual: false, confidence: 76 },
  ]

  const combinedDemandData = [...historicalDemandData, ...forecastedDemandData]

  // Site-specific demand forecasting
  const siteDemandForecast = sites.map((site, index) => ({
    name: site.name,
    currentDemand: Math.floor(Math.random() * 10) + 5,
    predictedDemand: Math.floor(Math.random() * 12) + 6,
    confidence: Math.floor(Math.random() * 20) + 80,
    trend: Math.random() > 0.5 ? "up" : "down",
    priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
  }))

  // Equipment positioning recommendations
  const positioningRecommendations = [
    {
      equipmentType: "Excavator",
      currentLocation: "Equipment Yard",
      recommendedLocation: "Manhattan Tower Project",
      reason: "High predicted demand (85% confidence)",
      urgency: "High",
      estimatedRevenue: "$12,500",
    },
    {
      equipmentType: "Bulldozer",
      currentLocation: "Brooklyn Site",
      recommendedLocation: "Staten Island Mining",
      reason: "Seasonal demand increase expected",
      urgency: "Medium",
      estimatedRevenue: "$8,200",
    },
    {
      equipmentType: "Crane",
      currentLocation: "Queens Service Center",
      recommendedLocation: "Bronx Development",
      reason: "Project timeline alignment",
      urgency: "Low",
      estimatedRevenue: "$6,800",
    },
  ]

  // Seasonal patterns
  const seasonalPatterns = [
    { season: "Spring", demand: 85, trend: "High construction activity" },
    { season: "Summer", demand: 95, trend: "Peak construction season" },
    { season: "Fall", demand: 75, trend: "Moderate activity" },
    { season: "Winter", demand: 45, trend: "Reduced outdoor work" },
  ]

  // Market insights
  const marketInsights = [
    {
      title: "Construction Boom Expected",
      description: "Infrastructure projects increasing demand by 25%",
      impact: "High",
      timeframe: "Next 3 months",
      confidence: 89,
    },
    {
      title: "Seasonal Maintenance Period",
      description: "Equipment maintenance will reduce availability",
      impact: "Medium",
      timeframe: "Next month",
      confidence: 94,
    },
    {
      title: "New Competitor Entry",
      description: "Market competition may affect pricing",
      impact: "Low",
      timeframe: "Next 6 months",
      confidence: 72,
    },
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Forecasting Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>AI-Powered Demand Forecasting</span>
          </CardTitle>
          <CardDescription>Predictive analytics for equipment demand and positioning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Forecast period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Next 7 days</SelectItem>
                <SelectItem value="30d">Next 30 days</SelectItem>
                <SelectItem value="90d">Next 3 months</SelectItem>
                <SelectItem value="1y">Next year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedEquipmentType} onValueChange={setSelectedEquipmentType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Equipment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                <SelectItem value="excavator">Excavator</SelectItem>
                <SelectItem value="bulldozer">Bulldozer</SelectItem>
                <SelectItem value="crane">Crane</SelectItem>
                <SelectItem value="grader">Grader</SelectItem>
                <SelectItem value="loader">Loader</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Forecast Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Demand</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">89% confidence</span> next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Forecast</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$156K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+18%</span> from current month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Forecast</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-600">Peak season</span> approaching
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">Improving</span> with more data
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting Tabs */}
      <Tabs defaultValue="demand" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="demand">Demand Trends</TabsTrigger>
          <TabsTrigger value="positioning">Positioning</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-6">
          {/* Historical vs Forecasted Demand */}
          <Card>
            <CardHeader>
              <CardTitle>Demand Forecast by Equipment Type</CardTitle>
              <CardDescription>Historical data and AI predictions for the next 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={combinedDemandData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="excavator" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                  <Area type="monotone" dataKey="bulldozer" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                  <Area type="monotone" dataKey="crane" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.35} />
                  <Area type="monotone" dataKey="grader" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.35} />
                  <Area type="monotone" dataKey="loader" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.35} />
                  <Line type="monotone" dataKey="confidence" stroke="#111827" strokeDasharray="5 5" name="Confidence" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Equipment Type Forecast */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demandForecast.map((forecast, index) => (
              <Card key={forecast.equipmentType}>
                <CardHeader>
                  <CardTitle className="text-lg">{forecast.equipmentType}</CardTitle>
                  <CardDescription>30-day demand prediction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Predicted Demand</span>
                      <span className="font-semibold">{forecast.predictedDemand}%</span>
                    </div>
                    <Progress value={forecast.predictedDemand} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confidence Level</span>
                      <span className={`font-semibold ${getConfidenceColor(forecast.confidence)}`}>
                        {forecast.confidence}%
                      </span>
                    </div>
                    <Progress value={forecast.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="positioning" className="space-y-6">
          {/* Site Demand Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Site-Specific Demand Forecast</CardTitle>
              <CardDescription>Predicted equipment demand by construction site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteDemandForecast.map((site) => (
                  <div key={site.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-semibold">{site.name}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(site.trend)}
                        <Badge
                          variant={
                            site.priority === "High"
                              ? "destructive"
                              : site.priority === "Medium"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {site.priority} Priority
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Demand</p>
                        <p className="font-medium">{site.currentDemand} units</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Predicted Demand</p>
                        <p className="font-medium">{site.predictedDemand} units</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className={`font-medium ${getConfidenceColor(site.confidence)}`}>{site.confidence}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Positioning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Positioning Recommendations</CardTitle>
              <CardDescription>AI-suggested equipment relocations for optimal demand coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positioningRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{rec.equipmentType}</h4>
                      <Badge
                        variant={
                          rec.urgency === "High" ? "destructive" : rec.urgency === "Medium" ? "secondary" : "outline"
                        }
                      >
                        {rec.urgency} Urgency
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Current Location</p>
                        <p className="font-medium">{rec.currentLocation}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recommended Location</p>
                        <p className="font-medium">{rec.recommendedLocation}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        <p className="text-sm font-medium text-green-600">Est. Revenue: {rec.estimatedRevenue}</p>
                      </div>
                      <Button
                        size="sm"
                        variant={implemented[index] ? "outline" : "default"}
                        onClick={() => setImplemented({ ...implemented, [index]: true })}
                        disabled={implemented[index]}
                      >
                        {implemented[index] ? "Implemented" : "Implement"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6">
          {/* Seasonal Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Demand Patterns</CardTitle>
              <CardDescription>Historical seasonal trends and predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={seasonalPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="season" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demand" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Seasonal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {seasonalPatterns.map((pattern) => (
              <Card key={pattern.season}>
                <CardHeader>
                  <CardTitle className="text-lg">{pattern.season}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Demand Level</span>
                      <span className="font-semibold">{pattern.demand}%</span>
                    </div>
                    <Progress value={pattern.demand} className="h-2" />
                    <p className="text-sm text-muted-foreground">{pattern.trend}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Market Insights & Predictions</CardTitle>
              <CardDescription>AI-generated insights from market data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                      <Badge
                        variant={
                          insight.impact === "High"
                            ? "destructive"
                            : insight.impact === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {insight.impact} Impact
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">Timeframe: {insight.timeframe}</span>
                        <span className={`font-medium ${getConfidenceColor(insight.confidence)}`}>
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setInsightInModal(insight)}>
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{insight.title}</DialogTitle>
                            <DialogDescription>{insight.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Impact:</span> {insight.impact}
                            </div>
                            <div>
                              <span className="font-medium">Timeframe:</span> {insight.timeframe}
                            </div>
                            <div>
                              <span className="font-medium">Confidence:</span> {insight.confidence}%
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Action Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>AI-suggested actions based on demand forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">Increase Excavator Fleet</h4>
                      <p className="text-sm text-green-700 mt-1">
                        High demand predicted for excavators in Q3. Consider acquiring 2-3 additional units.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-green-600">Expected ROI: 34%</span>
                        <Button size="sm" variant="outline">
                          Plan Acquisition
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-800">Schedule Preventive Maintenance</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Peak season approaching. Schedule maintenance for 4 units during low-demand period.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-yellow-600">Optimal window: Next 2 weeks</span>
                        <Button size="sm" variant="outline">
                          Schedule Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-start space-x-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">Optimize Pricing Strategy</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Market analysis suggests 8-12% price increase opportunity for high-demand equipment.
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-blue-600">Revenue impact: +$23K/month</span>
                        <Button size="sm" variant="outline">
                          Review Pricing
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}