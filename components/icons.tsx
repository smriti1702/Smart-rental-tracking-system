import React from "react"

function makeIcon(name: string) {
  return function Icon({ className }: { className?: string }) {
    return <span className={className} aria-label={name}>◆</span>
  }
}

export const AlertTriangle = makeIcon("AlertTriangle")
export const CheckCircle = makeIcon("CheckCircle")
export const Clock = makeIcon("Clock")
export const Fuel = makeIcon("Fuel")
export const Wrench = makeIcon("Wrench")
export const Bell = makeIcon("Bell")
export const BellOff = makeIcon("BellOff")
export const Search = makeIcon("Search")
export const Filter = makeIcon("Filter")
export const Settings = makeIcon("Settings")
export const Eye = makeIcon("Eye")
export const X = makeIcon("X")
export const AlertCircle = makeIcon("AlertCircle")
export const Info = makeIcon("Info")
export const QrCode = makeIcon("QrCode")
export const Scan = makeIcon("Scan")
export const User = makeIcon("User")
export const MapPin = makeIcon("MapPin")
export const TrendingUp = makeIcon("TrendingUp")
export const Download = makeIcon("Download")
export const TrendingDown = makeIcon("TrendingDown")
export const Brain = makeIcon("Brain")
export const Target = makeIcon("Target")
export const Calendar = makeIcon("Calendar")
export const DollarSign = makeIcon("DollarSign")
export const Phone = makeIcon("Phone")
export const Mail = makeIcon("Mail")


