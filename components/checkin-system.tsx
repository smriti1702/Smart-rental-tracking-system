"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { QrCode, Scan, CheckCircle, Clock, User, MapPin, AlertCircle } from "./icons"
import { dataManager } from "../lib/dataManager"
import type { Equipment } from "../types"

export function CheckInSystem() {
  const [scanMode, setScanMode] = useState<"checkin" | "checkout" | null>(null)
  const [scannedCode, setScannedCode] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [selectedOperator, setSelectedOperator] = useState("")
  const [selectedSite, setSelectedSite] = useState("")
  const [plannedReturnDate, setPlannedReturnDate] = useState("")
  const [checkInData, setCheckInData] = useState({
    engineHours: "",
    fuelLevel: "",
    condition: "",
    notes: "",
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const equipment = dataManager.getAllEquipment()
  const operators = dataManager.getAllOperators()
  const sites = dataManager.getAllSites()
  const rentals = dataManager.getAllRentals()

  const availableEquipment = equipment.filter((eq) => eq.status === "available")
  const rentedEquipment = equipment.filter((eq) => eq.status === "rented" || eq.status === "overdue")

  const handleQRScan = (code: string) => {
    setScannedCode(code)

    // Parse QR code to extract equipment ID
    const parts = code.split("_")
    if (parts.length >= 3) {
      const equipmentId = parts[2]
      const foundEquipment = equipment.find((eq) => eq.id === equipmentId)
      if (foundEquipment) {
        setSelectedEquipment(foundEquipment)
      }
    }
  }

  const handleCheckOut = () => {
    if (!selectedEquipment || !selectedOperator || !selectedSite || !plannedReturnDate) {
      return
    }

    const rentalId = dataManager.checkOutEquipment(
      selectedEquipment.id,
      selectedOperator,
      selectedSite,
      plannedReturnDate,
    )

    setSuccessMessage(
      `Equipment ${selectedEquipment.id} successfully checked out to ${operators.find((op) => op.id === selectedOperator)?.name}`,
    )
    setShowSuccess(true)
    resetForm()
  }

  const handleCheckIn = () => {
    if (!selectedEquipment || !checkInData.engineHours) {
      return
    }

    const rental = rentals.find((r) => r.equipmentId === selectedEquipment.id && r.status === "active")
    if (rental) {
      dataManager.checkInEquipment(rental.id, Number.parseInt(checkInData.engineHours))
      setSuccessMessage(`Equipment ${selectedEquipment.id} successfully checked in`)
      setShowSuccess(true)
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedEquipment(null)
    setSelectedOperator("")
    setSelectedSite("")
    setPlannedReturnDate("")
    setCheckInData({ engineHours: "", fuelLevel: "", condition: "", notes: "" })
    setScannedCode("")
    setScanMode(null)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const generateQRCode = (equipmentId: string) => {
    const rental = rentals.find((r) => r.equipmentId === equipmentId && r.status === "active")
    return rental?.qrCode || `QR_MANUAL_${equipmentId}`
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-blue-500" />
              <span>Quick Check-Out</span>
            </CardTitle>
            <CardDescription>Check out available equipment to operators</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setScanMode("checkout")}
              className="w-full"
              disabled={availableEquipment.length === 0}
            >
              <Scan className="w-4 h-4 mr-2" />
              Start Check-Out Process
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              {availableEquipment.length} equipment available for checkout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Quick Check-In</span>
            </CardTitle>
            <CardDescription>Return rented equipment and record usage</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setScanMode("checkin")} className="w-full" disabled={rentedEquipment.length === 0}>
              <Scan className="w-4 h-4 mr-2" />
              Start Check-In Process
            </Button>
            <p className="text-sm text-muted-foreground mt-2">{rentedEquipment.length} equipment currently rented</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Check-In/Out Interface */}
      {scanMode && (
        <Card>
          <CardHeader>
            <CardTitle>{scanMode === "checkout" ? "Equipment Check-Out" : "Equipment Check-In"}</CardTitle>
            <CardDescription>
              {scanMode === "checkout"
                ? "Assign equipment to operators and sites"
                : "Return equipment and record usage data"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Scanner Simulation */}
            <div className="space-y-4">
              <Label>QR Code / RFID Scanner</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Scan QR code or enter equipment ID manually..."
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                />
                <Button onClick={() => handleQRScan(scannedCode)} disabled={!scannedCode}>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan
                </Button>
              </div>

              {/* Quick Select for Demo */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Or select equipment directly:</Label>
                <Select
                  onValueChange={(value) => {
                    const eq = equipment.find((e) => e.id === value)
                    if (eq) {
                      setSelectedEquipment(eq)
                      setScannedCode(generateQRCode(eq.id))
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(scanMode === "checkout" ? availableEquipment : rentedEquipment).map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.id} - {eq.type} {eq.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Equipment Details */}
            {selectedEquipment && (
              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">Equipment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>
                        <span className="font-medium">ID:</span> {selectedEquipment.id}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span> {selectedEquipment.type}
                      </p>
                      <p>
                        <span className="font-medium">Model:</span> {selectedEquipment.model}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <Badge
                          className="ml-2"
                          variant={selectedEquipment.status === "available" ? "default" : "secondary"}
                        >
                          {selectedEquipment.status}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">Engine Hours:</span>{" "}
                        {selectedEquipment.specifications.engineHours.toLocaleString()}h
                      </p>
                      <p>
                        <span className="font-medium">Location:</span> {selectedEquipment.location.address}
                      </p>
                      <p>
                        <span className="font-medium">QR Code:</span> {scannedCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Check-Out Form */}
            {scanMode === "checkout" && selectedEquipment && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign to Operator</Label>
                    <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator..." />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.id} value={op.id}>
                            {op.name} - {op.licenseNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Assign to Site</Label>
                    <Select value={selectedSite} onValueChange={setSelectedSite}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Planned Return Date</Label>
                  <Input
                    type="date"
                    value={plannedReturnDate}
                    onChange={(e) => setPlannedReturnDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <Button
                  onClick={handleCheckOut}
                  className="w-full"
                  disabled={!selectedOperator || !selectedSite || !plannedReturnDate}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Check-Out
                </Button>
              </div>
            )}

            {/* Check-In Form */}
            {scanMode === "checkin" && selectedEquipment && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Engine Hours *</Label>
                    <Input
                      type="number"
                      placeholder="Enter current engine hours..."
                      value={checkInData.engineHours}
                      onChange={(e) => setCheckInData({ ...checkInData, engineHours: e.target.value })}
                      min={selectedEquipment.specifications.engineHours}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fuel Level (%)</Label>
                    <Input
                      type="number"
                      placeholder="Enter fuel level percentage..."
                      value={checkInData.fuelLevel}
                      onChange={(e) => setCheckInData({ ...checkInData, fuelLevel: e.target.value })}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Equipment Condition</Label>
                  <Select
                    value={checkInData.condition}
                    onValueChange={(value) => setCheckInData({ ...checkInData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs_maintenance">Needs Maintenance</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any issues, maintenance needs, or observations..."
                    value={checkInData.notes}
                    onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleCheckIn} className="w-full" disabled={!checkInData.engineHours}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Check-In
                </Button>
              </div>
            )}

            {/* Cancel Button */}
            <Button variant="outline" onClick={resetForm} className="w-full bg-transparent">
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Rentals Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rentals</CardTitle>
          <CardDescription>Currently checked out equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rentals
              .filter((r) => r.status === "active" || r.status === "overdue")
              .map((rental) => {
                const equipment = dataManager.getEquipmentById(rental.equipmentId)
                const operator = operators.find((op) => op.id === rental.operatorId)
                const site = sites.find((s) => s.id === rental.siteId)
                const isOverdue = rental.status === "overdue"

                return (
                  <div
                    key={rental.id}
                    className={`p-4 rounded-lg border ${isOverdue ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${isOverdue ? "bg-red-500" : "bg-blue-500"}`}></div>
                        <div>
                          <p className="font-medium">
                            {equipment?.id} - {equipment?.type} {equipment?.model}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{operator?.name}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{site?.name}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Due: {rental.plannedReturnDate}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isOverdue && (
                          <Badge variant="destructive" className="flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>Overdue</span>
                          </Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <QrCode className="w-3 h-3 mr-1" />
                              QR Code
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>QR Code - {equipment?.id}</DialogTitle>
                              <DialogDescription>Scan this code for quick check-in</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                              <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                                  <p className="text-xs text-gray-500">QR Code</p>
                                  <p className="text-xs font-mono">{rental.qrCode}</p>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground text-center">
                                Use this QR code to quickly check in this equipment
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                )
              })}

            {rentals.filter((r) => r.status === "active" || r.status === "overdue").length === 0 && (
              <p className="text-center text-muted-foreground py-8">No active rentals</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}