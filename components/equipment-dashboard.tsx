"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { MapPin, Clock, Search, Filter, Eye, Settings } from "./icons"
import { dataManager } from "../lib/dataManager"
import type { Equipment } from "../types"

const statusColors = {
  available: "bg-green-100 text-green-800 border-green-200",
  rented: "bg-blue-100 text-blue-800 border-blue-200",
  maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
}

const statusIcons = {
  available: "✓",
  rented: "⏱",
  maintenance: "🔧",
  overdue: "⚠",
}

export function EquipmentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const equipment = dataManager.getAllEquipment()
  const rentals = dataManager.getAllRentals()
  const operators = dataManager.getAllOperators()
  const sites = dataManager.getAllSites()

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesType = typeFilter === "all" || item.type === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [equipment, searchTerm, statusFilter, typeFilter])

  const getEquipmentRental = (equipmentId: string) => {
    return rentals.find((rental) => rental.equipmentId === equipmentId && rental.status === "active")
  }

  const getOperatorName = (operatorId: string) => {
    const operator = operators.find((op) => op.id === operatorId)
    return operator?.name || "Unknown"
  }

  const getSiteName = (siteId: string) => {
    const site = sites.find((s) => s.id === siteId)
    return site?.name || "Unknown"
  }

  const equipmentTypes = [...new Set(equipment.map((item) => item.type))]

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Equipment Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by ID, type, model, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusColors).map(([status, colorClass]) => {
          const count = equipment.filter((item) => item.status === status).length
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{status}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                    <span className="text-lg">{statusIcons[status as keyof typeof statusIcons]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Fleet ({filteredEquipment.length} items)</CardTitle>
          <CardDescription>Manage and monitor all equipment in your fleet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment ID</TableHead>
                  <TableHead>Type & Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Engine Hours</TableHead>
                  <TableHead>Current Assignment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((item) => {
                  const rental = getEquipmentRental(item.id)
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.type}</p>
                          <p className="text-sm text-muted-foreground">{item.model}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[item.status]}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{item.location.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{item.specifications.engineHours.toLocaleString()}h</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rental ? (
                          <div className="text-sm">
                            <p className="font-medium">{getOperatorName(rental.operatorId)}</p>
                            <p className="text-muted-foreground">{getSiteName(rental.siteId)}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEquipment(item)}>
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Equipment Details - {item.id}</DialogTitle>
                                <DialogDescription>Detailed information and specifications</DialogDescription>
                              </DialogHeader>
                              {selectedEquipment && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Basic Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <span className="font-medium">Type:</span> {selectedEquipment.type}
                                        </p>
                                        <p>
                                          <span className="font-medium">Model:</span> {selectedEquipment.model}
                                        </p>
                                        <p>
                                          <span className="font-medium">Serial:</span> {selectedEquipment.serialNumber}
                                        </p>
                                        <p>
                                          <span className="font-medium">Status:</span>
                                          <Badge className={`ml-2 ${statusColors[selectedEquipment.status]}`}>
                                            {selectedEquipment.status}
                                          </Badge>
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Specifications</h4>
                                      <div className="space-y-2 text-sm">
                                        <p>
                                          <span className="font-medium">Engine Hours:</span>{" "}
                                          {selectedEquipment.specifications.engineHours.toLocaleString()}h
                                        </p>
                                        <p>
                                          <span className="font-medium">Fuel Capacity:</span>{" "}
                                          {selectedEquipment.specifications.fuelCapacity}L
                                        </p>
                                        <p>
                                          <span className="font-medium">Operating Weight:</span>{" "}
                                          {selectedEquipment.specifications.operatingWeight.toLocaleString()}kg
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Current Location</h4>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <MapPin className="w-4 h-4 text-muted-foreground" />
                                      <span>{selectedEquipment.location.address}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Coordinates: {selectedEquipment.location.lat}, {selectedEquipment.location.lng}
                                    </p>
                                  </div>

                                  {rental && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Current Rental</h4>
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p>
                                            <span className="font-medium">Operator:</span>{" "}
                                            {getOperatorName(rental.operatorId)}
                                          </p>
                                          <p>
                                            <span className="font-medium">Site:</span> {getSiteName(rental.siteId)}
                                          </p>
                                        </div>
                                        <div>
                                          <p>
                                            <span className="font-medium">Check Out:</span> {rental.checkOutDate}
                                          </p>
                                          <p>
                                            <span className="font-medium">Planned Return:</span>{" "}
                                            {rental.plannedReturnDate}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Settings className="w-3 h-3 mr-1" />
                                      Manage
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      Track Location
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
