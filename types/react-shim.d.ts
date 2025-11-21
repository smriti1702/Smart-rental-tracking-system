declare module "react" {
  export function useState<T = any>(initial?: T): [T, (v: T | ((prev: T) => T)) => void]
  export function useEffect(effect: any, deps?: any[]): void
  export function useMemo<T = any>(fn: () => T, deps?: any[]): T
  const React: any
  export default React
}



