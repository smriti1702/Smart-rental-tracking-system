import React from "react"

type SelectProps = {
  value?: string
  onValueChange?: (v: string) => void
  children?: React.ReactNode
}

// Minimal, accessible Select implementation compatible with our existing usage.
export function Select({ value, onValueChange, children }: SelectProps) {
  const items: { value: string; label: string }[] = []
  let placeholder: string | undefined
  let triggerClassName: string | undefined

  const traverse = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return
      const typeAny: any = child.type
      if (typeAny && typeAny.IS_SELECT_VALUE && child.props?.placeholder) {
        placeholder = child.props.placeholder
      }
      if (typeAny && typeAny.IS_SELECT_TRIGGER && child.props?.className) {
        triggerClassName = child.props.className
      }
      if (typeAny && typeAny.IS_SELECT_ITEM) {
        items.push({ value: child.props.value, label: String(child.props.children ?? child.props.value) })
      }
      if (child.props && child.props.children) traverse(child.props.children)
    })
  }
  traverse(children)

  const effectiveValue = value ?? ""
  const hasValue = items.some((i) => i.value === effectiveValue)

  const widthClass = triggerClassName || "w-full"

  return (
    <select
      value={hasValue ? effectiveValue : ""}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={`border rounded px-3 py-2 bg-white ${widthClass}`}
    >
      <option value="" disabled hidden>
        {placeholder || "Select..."}
      </option>
      {items.map((i) => (
        <option key={i.value} value={i.value}>
          {i.label}
        </option>
      ))}
    </select>
  )
}

export function SelectTrigger({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
(SelectTrigger as any).IS_SELECT_TRIGGER = true

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span>{placeholder}</span>
}
;(SelectValue as any).IS_SELECT_VALUE = true

export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <div className="hidden">{children}</div>
}

export function SelectItem(props: { value: string; children?: React.ReactNode; [key: string]: any }) {
  const { value, children, ...rest } = props
  return (
    <div data-value={value} {...rest}>
      {children}
    </div>
  )
}
;(SelectItem as any).IS_SELECT_ITEM = true


