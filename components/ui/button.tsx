import React from "react"

export function Button({ children, className, onClick, variant, size, disabled }: { children?: React.ReactNode; className?: string; onClick?: React.MouseEventHandler<HTMLButtonElement>; variant?: "outline" | "default"; size?: "sm" | "md" | "lg"; disabled?: boolean }) {
  const base = "inline-flex items-center gap-1 rounded border px-3 py-1 text-sm"
  const styles = variant === "outline" ? "bg-white" : "bg-gray-100"
  const sizes = size === "sm" ? "px-2 py-1 text-xs" : size === "lg" ? "px-4 py-2" : ""
  return (
    <button className={`${base} ${styles} ${sizes} ${className || ""}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}


