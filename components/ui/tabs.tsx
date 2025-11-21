import React, { useState } from "react"

export function Tabs({ defaultValue, className, children }: { defaultValue: string; className?: string; children?: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return <div className={className}>{React.Children.map(children, (child: any) => React.cloneElement(child, { __tabsValue: value, __setTabsValue: setValue }))}</div>
}

export function TabsList({ children, className, __tabsValue, __setTabsValue }: any) {
  return <div className={className}>{React.Children.map(children, (child: any) => React.cloneElement(child, { __tabsValue, __setTabsValue }))}</div>
}

export function TabsTrigger({ value, children, __tabsValue, __setTabsValue }: any) {
  const active = __tabsValue === value
  return (
    <button onClick={() => __setTabsValue(value)} className={`px-3 py-2 text-sm border ${active ? "bg-white" : "bg-gray-100"}`}>
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className, __tabsValue }: any) {
  if (__tabsValue !== value) return null
  return <div className={className}>{children}</div>
}


