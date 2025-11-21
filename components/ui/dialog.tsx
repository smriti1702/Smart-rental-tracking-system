import React from "react"

export function Dialog({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>
}

export function DialogTrigger({ children, asChild }: { children?: React.ReactNode; asChild?: boolean }) {
  return <div>{children}</div>
}

export function DialogContent({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={`border rounded p-4 bg-white ${className || ""}`}>{children}</div>
}

export function DialogHeader({ children }: { children?: React.ReactNode }) {
  return <div className="mb-2">{children}</div>
}

export function DialogTitle({ children }: { children?: React.ReactNode }) {
  return <h4 className="font-semibold">{children}</h4>
}

export function DialogDescription({ children }: { children?: React.ReactNode }) {
  return <p className="text-sm text-gray-500">{children}</p>
}


