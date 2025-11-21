import React from "react"

export function Table({ children }: { children?: React.ReactNode }) {
  return <table className="w-full text-sm">{children}</table>
}

export function TableHeader({ children }: { children?: React.ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>
}

export function TableBody({ children }: { children?: React.ReactNode }) {
  return <tbody className="divide-y">{children}</tbody>
}

export function TableRow({ children }: { children?: React.ReactNode }) {
  return <tr className="border-b last:border-b-0">{children}</tr>
}

export function TableHead({ children }: { children?: React.ReactNode }) {
  return <th className="text-left p-3 font-medium">{children}</th>
}

export function TableCell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`p-3 ${className || ""}`}>{children}</td>
}


