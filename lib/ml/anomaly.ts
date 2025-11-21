import type { AnomalyDetectionResult, UsageAnalytics } from "../../types"

// Enhanced anomaly detection using multiple algorithms
export function detectUsageAnomalies(usage: UsageAnalytics[]): AnomalyDetectionResult[] {
  if (usage.length === 0) return []

  const results: AnomalyDetectionResult[] = []
  
  // 1. Z-score based detection (existing method)
  results.push(...zScoreAnomalyDetection(usage))
  
  // 2. Isolation Forest based detection
  results.push(...isolationForestAnomalyDetection(usage))
  
  // 3. Statistical outlier detection
  results.push(...statisticalOutlierDetection(usage))
  
  // 4. Pattern-based anomaly detection
  results.push(...patternBasedAnomalyDetection(usage))

  
  // Remove duplicates and merge similar anomalies
  return mergeSimilarAnomalies(results)

}

// Enhanced Z-score based detection with multiple metrics
function zScoreAnomalyDetection(usage: UsageAnalytics[]): AnomalyDetectionResult[] {
  const results: AnomalyDetectionResult[] = []
  
  const metrics = [
    { name: 'idleRatio', extractor: (u: UsageAnalytics) => u.idleHours / Math.max(1, u.totalHours) },
    { name: 'fuelEfficiency', extractor: (u: UsageAnalytics) => u.fuelEfficiency },
    { name: 'utilizationRate', extractor: (u: UsageAnalytics) => u.utilizationRate },
    { name: 'maintenanceScore', extractor: (u: UsageAnalytics) => u.maintenanceScore || 0 }
  ]

  for (const metric of metrics) {
    const values = usage.map(u => metric.extractor(u))
    const stats = calculateStats(values)
    
    for (const u of usage) {
      const value = metric.extractor(u)
      const zScore = (value - stats.mean) / Math.max(1, stats.std)
      
      if (Math.abs(zScore) > 2.5) {
        const anomalyType = getAnomalyType(metric.name, zScore)
        const severity = Math.abs(zScore) > 3.5 ? "high" : Math.abs(zScore) > 2.5 ? "medium" : "low"
        
        results.push({
          equipmentId: u.equipmentId,
          anomalyType,
          severity,
          score: Number(Math.abs(zScore).toFixed(2)),
          description: `${metric.name} anomaly: ${value.toFixed(2)} (Z-score: ${zScore.toFixed(2)})`,
          algorithm: "z-score",
          confidence: Math.min(95, 70 + Math.abs(zScore) * 5)
        })
      }
    }
  }
  
  return results
}

// Isolation Forest algorithm for anomaly detection
function isolationForestAnomalyDetection(usage: UsageAnalytics[]): AnomalyDetectionResult[] {
  const results: AnomalyDetectionResult[] = []
  
  if (usage.length < 10) return results // Need minimum data for isolation forest
  
  const features = usage.map(u => [
    u.idleHours / Math.max(1, u.totalHours),
    u.fuelEfficiency,
    u.utilizationRate,
    (u.maintenanceScore || 0) / 100
  ])
  
  const anomalyScores = isolationForest(features, 100, 256) // 100 trees, 256 samples
  
  for (let i = 0; i < usage.length; i++) {
    if (anomalyScores[i] > 0.6) { // Threshold for anomaly
      const u = usage[i]
      const severity = anomalyScores[i] > 0.8 ? "high" : anomalyScores[i] > 0.6 ? "medium" : "low"
      
      results.push({
        equipmentId: u.equipmentId,
        anomalyType: "Isolation Forest Anomaly",
        severity,
        score: Number((anomalyScores[i] * 100).toFixed(2)),
        description: `Machine learning detected anomaly with score ${(anomalyScores[i] * 100).toFixed(1)}%`,
        algorithm: "isolation-forest",
        confidence: Math.round(anomalyScores[i] * 100)
      })
    }
  }
  
  return results
}

// Statistical outlier detection using IQR method
function statisticalOutlierDetection(usage: UsageAnalytics[]): AnomalyDetectionResult[] {
  const results: AnomalyDetectionResult[] = []
  
  const metrics = [
    { name: 'idleRatio', extractor: (u: UsageAnalytics) => u.idleHours / Math.max(1, u.totalHours) },
    { name: 'fuelEfficiency', extractor: (u: UsageAnalytics) => u.fuelEfficiency }
  ]
  
  for (const metric of metrics) {
    const values = usage.map(u => metric.extractor(u)).sort((a, b) => a - b)
    const { q1, q3, iqr } = calculateQuartiles(values)
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr
    
    for (const u of usage) {
      const value = metric.extractor(u)
      
      if (value < lowerBound || value > upperBound) {
        const anomalyType = value < lowerBound ? `${metric.name} Below Normal` : `${metric.name} Above Normal`
        const severity = Math.abs(value - (value < lowerBound ? lowerBound : upperBound)) / iqr > 2 ? "high" : "medium"
        
        results.push({
          equipmentId: u.equipmentId,
          anomalyType,
          severity,
          score: Number((Math.abs(value - (value < lowerBound ? lowerBound : upperBound)) / iqr).toFixed(2)),
          description: `${metric.name} outlier: ${value.toFixed(2)} (bounds: ${lowerBound.toFixed(2)} - ${upperBound.toFixed(2)})`,
          algorithm: "iqr",
          confidence: 75
        })
      }
    }
  }
  
  return results
}

// Pattern-based anomaly detection for time series data
function patternBasedAnomalyDetection(usage: UsageAnalytics[]): AnomalyDetectionResult[] {
  const results: AnomalyDetectionResult[] = []
  
  if (usage.length < 5) return results
  
  // Group by equipment and detect sudden changes
  const equipmentGroups = groupBy(usage, 'equipmentId')
  
  for (const [equipmentId, equipmentUsage] of Object.entries(equipmentGroups)) {
    if (equipmentUsage.length < 3) continue
    
    // Sort by date and detect sudden drops/increases
    const sortedUsage = equipmentUsage.sort((a, b) => 
      new Date(a.timestamp || Date.now()).getTime() - new Date(b.timestamp || Date.now()).getTime()
    )
    
    for (let i = 1; i < sortedUsage.length; i++) {
      const current = sortedUsage[i]
      const previous = sortedUsage[i - 1]
      
      const utilizationChange = Math.abs(current.utilizationRate - previous.utilizationRate)
      const fuelChange = Math.abs(current.fuelEfficiency - previous.fuelEfficiency)
      
      if (utilizationChange > 30 || fuelChange > 0.5) {
        const anomalyType = utilizationChange > 30 ? "Sudden Utilization Change" : "Sudden Fuel Efficiency Change"
        const severity = Math.max(utilizationChange / 30, fuelChange / 0.5) > 2 ? "high" : "medium"
        
        results.push({
          equipmentId,
          anomalyType,
          severity,
          score: Number(Math.max(utilizationChange / 30, fuelChange / 0.5).toFixed(2)),
          description: `Sudden change detected: utilization ${utilizationChange.toFixed(1)}%, fuel ${fuelChange.toFixed(2)}`,
          algorithm: "pattern-detection",
          confidence: 80
        })
      }
    }
  }
  
  return results
}

// Helper functions
function calculateStats(values: number[]) {
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / Math.max(1, values.length - 1)
  const std = Math.sqrt(variance)
  return { mean, std }
}

function calculateQuartiles(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  const q1 = sorted[Math.floor(sorted.length * 0.25)]
  const q3 = sorted[Math.floor(sorted.length * 0.75)]
  const iqr = q3 - q1
  return { q1, q3, iqr }
}

function isolationForest(features: number[][], nTrees: number, nSamples: number): number[] {
  const scores: number[] = new Array(features.length).fill(0)
  
  for (let tree = 0; tree < nTrees; tree++) {
    const sampleIndices = getRandomSampleIndices(features.length, nSamples)
    const sampleFeatures = sampleIndices.map(i => features[i])
    
    for (let i = 0; i < features.length; i++) {
      const pathLength = calculatePathLength(features[i], sampleFeatures, 0, 0)
      const expectedPathLength = Math.log2(sampleFeatures.length)
      scores[i] += pathLength / expectedPathLength
    }
  }
  
  // Normalize scores
  const maxScore = Math.max(...scores)
  return scores.map(s => s / maxScore)
}

function calculatePathLength(point: number[], data: number[][], depth: number, maxDepth: number): number {
  if (data.length <= 1 || depth >= maxDepth) return depth
  
  const randomFeature = Math.floor(Math.random() * point.length)
  const randomSplit = data[Math.floor(Math.random() * data.length)][randomFeature]
  
  const left = data.filter(d => d[randomFeature] < randomSplit)
  const right = data.filter(d => d[randomFeature] >= randomSplit)
  
  return calculatePathLength(point, point[randomFeature] < randomSplit ? left : right, depth + 1, maxDepth)
}

function getRandomSampleIndices(total: number, sampleSize: number): number[] {
  const indices = Array.from({ length: total }, (_, i) => i)
  const sampled: number[] = []
  
  for (let i = 0; i < Math.min(sampleSize, total); i++) {
    const randomIndex = Math.floor(Math.random() * indices.length)
    sampled.push(indices[randomIndex])
    indices.splice(randomIndex, 1)
  }
  
  return sampled
}

function getAnomalyType(metricName: string, zScore: number): string {
  const direction = zScore > 0 ? "High" : "Low"
  return `${direction} ${metricName.charAt(0).toUpperCase() + metricName.slice(1)}`
}

function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) groups[groupKey] = []
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

function mergeSimilarAnomalies(anomalies: AnomalyDetectionResult[]): AnomalyDetectionResult[] {
  const merged = new Map<string, AnomalyDetectionResult>()
  
  for (const anomaly of anomalies) {
    const key = `${anomaly.equipmentId}_${anomaly.anomalyType}`
    
    if (merged.has(key)) {
      const existing = merged.get(key)!
      existing.score = Math.max(existing.score, anomaly.score)
      existing.confidence = Math.max(existing.confidence, anomaly.confidence)
      existing.description = `${existing.description}; ${anomaly.description}`
    } else {
      merged.set(key, { ...anomaly })
    }
  }
  
  return Array.from(merged.values())
}


/* --------------------------------------------*/

