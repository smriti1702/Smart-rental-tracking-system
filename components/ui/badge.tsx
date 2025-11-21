import React from "react"

export function Badge({ children, className, variant }: { children?: React.ReactNode; className?: string; variant?: "outline" | "secondary" | "destructive" | "default" }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs border"
  const styles =
    variant === "outline"
      ? "bg-white"
      : variant === "secondary"
      ? "bg-gray-100"
      : variant === "destructive"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-gray-100"
  return <span className={`${base} ${styles} ${className || ""}`}>{children}</span>
}


