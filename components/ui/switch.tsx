import React, { useState } from "react"

export function Switch({ id, checked, defaultChecked, onCheckedChange }: { id?: string; checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (v: boolean) => void }) {
  const [internal, setInternal] = useState(Boolean(defaultChecked))
  const isChecked = typeof checked === "boolean" ? checked : internal
  return (
    <button
      id={id}
      onClick={() => {
        const next = !isChecked
        setInternal(next)
        onCheckedChange && onCheckedChange(next)
      }}
      className={`w-10 h-5 rounded-full border ${isChecked ? "bg-green-500" : "bg-gray-300"}`}
    />
  )
}


