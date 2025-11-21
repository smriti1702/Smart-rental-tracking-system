import React from "react"

export function Progress({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full bg-gray-200 rounded ${className || "h-3"}`}>
      <div className="bg-blue-500 h-full rounded" style={{ width: `${clamped}%` }} />
    </div>
  )
}



