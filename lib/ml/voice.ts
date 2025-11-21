import type { VoiceIntent } from "../../types"

// Enhanced Voice Recognition and NLP Model
export interface EnhancedVoiceIntent extends VoiceIntent {
  confidence: number
  entities: Record<string, string | number>
  context: string
  suggestedActions: string[]
  language: string
  sentiment: "positive" | "negative" | "neutral"
}

export interface VoiceCommand {
  text: string
  language: string
  timestamp: string
  userId?: string
  sessionId?: string
}

export interface IntentPattern {
  intent: string
  patterns: string[]
  examples: string[]
  responses: string[]
  requiredEntities: string[]
  optionalEntities: string[]
}

// Enhanced multilingual command parser with NLP capabilities
export function parseVoiceCommand(text: string, language = "auto"): EnhancedVoiceIntent {
  const normalized = text.toLowerCase().trim()
  const detectedLanguage = detectLanguage(normalized, language)
  
  // Extract entities first
  const entities = extractEntities(normalized, detectedLanguage)
  
  // Classify intent using multiple approaches
  const intentResults = classifyIntent(normalized, detectedLanguage, entities)
  
  // Determine sentiment
  const sentiment = analyzeSentiment(normalized, detectedLanguage)
  
  // Generate suggested actions
  const suggestedActions = generateSuggestedActions(intentResults.intent, entities)
  
  // Extract context
  const context = extractContext(normalized, entities, detectedLanguage)

  return {
    intent: intentResults.intent,
    language: detectedLanguage,
    confidence: intentResults.confidence,
    entities,
    context,
    suggestedActions,
    sentiment
  }
}

// Intent classification using multiple algorithms
function classifyIntent(
  text: string,
  language: string,
  entities: Record<string, string | number>
): { intent: string; confidence: number } {
  // 1. Pattern matching (existing method)
  const patternMatch = patternBasedClassification(text, language)
  
  // 2. Keyword-based classification
  const keywordMatch = keywordBasedClassification(text, language)
  
  // 3. Entity-based classification
  const entityMatch = entityBasedClassification(entities, language)
  
  // 4. Context-based classification
  const contextMatch = contextBasedClassification(text, entities, language)
  
  // Combine results using weighted scoring
  const scores = new Map<string, number>()
  
  // Pattern matching has highest weight
  if (patternMatch.intent !== "unknown") {
    scores.set(patternMatch.intent, (scores.get(patternMatch.intent) || 0) + patternMatch.confidence * 0.4)
  }
  
  // Keyword matching
  if (keywordMatch.intent !== "unknown") {
    scores.set(keywordMatch.intent, (scores.get(keywordMatch.intent) || 0) + keywordMatch.confidence * 0.3)
  }
  
  // Entity-based
  if (entityMatch.intent !== "unknown") {
    scores.set(entityMatch.intent, (scores.get(entityMatch.intent) || 0) + entityMatch.confidence * 0.2)
  }
  
  // Context-based
  if (contextMatch.intent !== "unknown") {
    scores.set(contextMatch.intent, (scores.get(contextMatch.intent) || 0) + contextMatch.confidence * 0.1)
  }
  
  // Find the intent with highest score
  let bestIntent = "unknown"
  let bestScore = 0
  
  for (const [intent, score] of scores) {
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent
    }
  }
  
  return {
    intent: bestIntent,
    confidence: Math.min(0.95, bestScore)
  }
}

// Pattern-based classification (enhanced version)
function patternBasedClassification(text: string, language: string): { intent: string; confidence: number } {
  const intents = getIntentPatterns(language)
  
  for (const intentDef of intents) {
    for (const pattern of intentDef.patterns) {
      if (text.includes(pattern.toLowerCase())) {
        return {
          intent: intentDef.intent,
          confidence: 0.8
        }
      }
    }
  }
  
  return { intent: "unknown", confidence: 0.4 }
}

// Keyword-based classification
function keywordBasedClassification(text: string, language: string): { intent: string; confidence: number } {
  const keywordMap = getKeywordMap(language)
  const words = text.split(/\s+/)
  
  const intentScores = new Map<string, number>()
  
  for (const word of words) {
    for (const [intent, keywords] of Object.entries(keywordMap)) {
      if (keywords.includes(word)) {
        intentScores.set(intent, (intentScores.get(intent) || 0) + 1)
      }
    }
  }
  
  if (intentScores.size === 0) {
    return { intent: "unknown", confidence: 0.3 }
  }
  
  // Find intent with most keyword matches
  let bestIntent = "unknown"
  let bestScore = 0
  
  for (const [intent, score] of intentScores) {
    if (score > bestScore) {
      bestScore = score
      bestIntent = intent
    }
  }
  
  return {
    intent: bestIntent,
    confidence: Math.min(0.9, bestScore / 3)
  }
}

// Entity-based classification
function entityBasedClassification(
  entities: Record<string, string | number>,
  language: string
): { intent: string; confidence: number } {
  const entityIntentMap = getEntityIntentMap(language)
  
  for (const [entityType, entityValue] of Object.entries(entities)) {
    for (const [intent, entityTypes] of Object.entries(entityIntentMap)) {
      if (entityTypes.includes(entityType)) {
        return {
          intent,
          confidence: 0.7
        }
      }
    }
  }
  
  return { intent: "unknown", confidence: 0.4 }
}

// Context-based classification
function contextBasedClassification(
  text: string,
  entities: Record<string, string | number>,
  language: string
): { intent: string; confidence: number } {
  const contextKeywords = getContextKeywords(language)
  
  for (const [intent, keywords] of Object.entries(contextKeywords)) {
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length
    if (matchCount > 0) {
      return {
        intent,
        confidence: Math.min(0.8, matchCount * 0.2)
      }
    }
  }
  
  return { intent: "unknown", confidence: 0.3 }
}

// Enhanced entity extraction
function extractEntities(text: string, language: string): Record<string, string | number> {
  const entities: Record<string, string | number> = {}
  
  // Equipment ID extraction
  const idMatch = text.match(/(equ|eq|equip|equipment)[-_\s]?(\d{3,6})/i)
  if (idMatch) entities["equipmentId"] = `EQU${idMatch[2]}`
  
  // Equipment type extraction
  const typeMatch = text.match(/excavator|crane|bulldozer|grader|loader|truck|trailer/i)
  if (typeMatch) entities["equipmentType"] = typeMatch[0].toLowerCase()
  
  // Site/location extraction
  const siteMatch = text.match(/(site|location|project)[-_\s]?(\d{3,6})/i)
  if (siteMatch) entities["siteId"] = `SITE${siteMatch[2]}`
  
  // Date/time extraction
  const dateMatch = text.match(/(today|tomorrow|next week|next month|in (\d+) days)/i)
  if (dateMatch) entities["timeReference"] = dateMatch[0]
  
  // Duration extraction
  const durationMatch = text.match(/(\d+)\s*(hours?|days?|weeks?|months?)/i)
  if (durationMatch) {
    const value = parseInt(durationMatch[1])
    const unit = durationMatch[2].toLowerCase()
    entities["duration"] = value
    entities["durationUnit"] = unit
  }
  
  // Cost extraction
  const costMatch = text.match(/(\d+(?:\.\d{2})?)\s*(dollars?|euros?|pounds?|rupees?)/i)
  if (costMatch) {
    entities["cost"] = parseFloat(costMatch[1])
    entities["currency"] = costMatch[2].toLowerCase()
  }
  
  // Priority extraction
  const priorityMatch = text.match(/(high|medium|low|urgent|critical)\s*priority/i)
  if (priorityMatch) entities["priority"] = priorityMatch[1].toLowerCase()
  
  // Status extraction
  const statusMatch = text.match(/(available|maintenance|rented|overdue|broken)/i)
  if (statusMatch) entities["status"] = statusMatch[1].toLowerCase()
  
  // Language-specific entity extraction
  const languageSpecificEntities = extractLanguageSpecificEntities(text, language)
  Object.assign(entities, languageSpecificEntities)
  
  return entities
}

// Language-specific entity extraction
function extractLanguageSpecificEntities(text: string, language: string): Record<string, string | number> {
  const entities: Record<string, string | number> = {}
  
  switch (language) {
    case "es": // Spanish
      const esIdMatch = text.match(/(equipo|maquina)[-_\s]?(\d{3,6})/i)
      if (esIdMatch) entities["equipmentId"] = `EQU${esIdMatch[2]}`
      break
      
    case "fr": // French
      const frIdMatch = text.match(/(equipement|machine)[-_\s]?(\d{3,6})/i)
      if (frIdMatch) entities["equipmentId"] = `EQU${frIdMatch[2]}`
      break
      
    case "hi": // Hindi
      const hiIdMatch = text.match(/(उपकरण|मशीन)[-_\s]?(\d{3,6})/i)
      if (hiIdMatch) entities["equipmentId"] = `EQU${hiIdMatch[2]}`
      break
      
    case "zh": // Chinese
      const zhIdMatch = text.match(/(设备|机器)[-_\s]?(\d{3,6})/i)
      if (zhIdMatch) entities["equipmentId"] = `EQU${zhIdMatch[2]}`
      break
  }
  
  return entities
}

// Language detection
function detectLanguage(text: string, specifiedLanguage: string): string {
  if (specifiedLanguage !== "auto") return specifiedLanguage
  
  // Simple language detection based on character sets
  if (/[а-яё]/i.test(text)) return "ru" // Russian
  if (/[一-龯]/.test(text)) return "zh" // Chinese
  if (/[あ-ん]/.test(text)) return "ja" // Japanese
  if (/[가-힣]/.test(text)) return "ko" // Korean
  if (/[अ-ह]/.test(text)) return "hi" // Hindi
  if (/[ء-ي]/.test(text)) return "ar" // Arabic
  
  // European languages
  if (/[ñáéíóúü]/i.test(text)) return "es" // Spanish
  if (/[àâäéèêëïîôùûüÿç]/i.test(text)) return "fr" // French
  if (/[äöüß]/i.test(text)) return "de" // German
  if (/[àáâãçéêíóôõú]/i.test(text)) return "pt" // Portuguese
  
  return "en" // Default to English
}

// Sentiment analysis
function analyzeSentiment(text: string, language: string): "positive" | "negative" | "neutral" {
  const positiveWords = getPositiveWords(language)
  const negativeWords = getNegativeWords(language)
  
  const words = text.toLowerCase().split(/\s+/)
  let positiveScore = 0
  let negativeScore = 0
  
  for (const word of words) {
    if (positiveWords.includes(word)) positiveScore++
    if (negativeWords.includes(word)) negativeScore++
  }
  
  if (positiveScore > negativeScore) return "positive"
  if (negativeScore > positiveScore) return "negative"
  return "neutral"
}

// Context extraction
function extractContext(
  text: string,
  entities: Record<string, string | number>,
  language: string
): string {
  const contextKeywords = getContextKeywords(language)
  const contexts: string[] = []
  
  for (const [intent, keywords] of Object.entries(contextKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword))
    if (matches.length > 0) {
      contexts.push(`${intent}: ${matches.join(", ")}`)
    }
  }
  
  return contexts.length > 0 ? contexts.join("; ") : "General inquiry"
}

// Suggested actions generation
function generateSuggestedActions(
  intent: string,
  entities: Record<string, string | number>
): string[] {
  const actions: string[] = []
  
  switch (intent) {
    case "check_status":
      if (entities.equipmentId) {
        actions.push(`Check status of ${entities.equipmentId}`)
      }
      actions.push("View all equipment status")
      break
      
    case "check_out":
      if (entities.equipmentId && entities.duration) {
        actions.push(`Check out ${entities.equipmentId} for ${entities.duration} ${entities.durationUnit || 'days'}`)
      }
      actions.push("Browse available equipment")
      break
      
    case "check_in":
      if (entities.equipmentId) {
        actions.push(`Check in ${entities.equipmentId}`)
      }
      actions.push("View active rentals")
      break
      
    case "find_available":
      if (entities.equipmentType) {
        actions.push(`Find available ${entities.equipmentType}s`)
      }
      actions.push("Search by location")
      actions.push("Filter by equipment type")
      break
      
    case "forecast_demand":
      actions.push("View demand forecast")
      actions.push("Analyze usage patterns")
      actions.push("Generate reports")
      break
      
    case "maintenance_request":
      if (entities.equipmentId) {
        actions.push(`Schedule maintenance for ${entities.equipmentId}`)
      }
      actions.push("View maintenance schedule")
      break
      
    case "cost_analysis":
      actions.push("View cost breakdown")
      actions.push("Generate cost report")
      actions.push("Analyze cost trends")
      break
  }
  
  return actions
}

// Helper functions for language-specific data
function getIntentPatterns(language: string): IntentPattern[] {
  const basePatterns: IntentPattern[] = [
    {
      intent: "check_status",
      patterns: ["status", "condition", "how is", "what's the status"],
      examples: ["What's the status of EQ001?", "How is the excavator doing?"],
      responses: ["Checking equipment status...", "Retrieving status information..."],
      requiredEntities: [],
      optionalEntities: ["equipmentId"]
    },
    {
      intent: "check_out",
      patterns: ["check out", "rent", "borrow", "need", "book"],
      examples: ["I need to check out EQ002", "Can I rent the crane?"],
      responses: ["Processing checkout request...", "Checking availability..."],
      requiredEntities: [],
      optionalEntities: ["equipmentId", "duration", "durationUnit"]
    },
    {
      intent: "check_in",
      patterns: ["check in", "return", "bring back", "done with"],
      examples: ["I'm returning EQ003", "Check in the bulldozer"],
      responses: ["Processing return...", "Updating equipment status..."],
      requiredEntities: [],
      optionalEntities: ["equipmentId"]
    },
    {
      intent: "find_available",
      patterns: ["available", "what's free", "show me", "find"],
      examples: ["What equipment is available?", "Find me a loader"],
      responses: ["Searching available equipment...", "Filtering results..."],
      requiredEntities: [],
      optionalEntities: ["equipmentType", "siteId"]
    },
    {
      intent: "forecast_demand",
      patterns: ["forecast", "predict", "trend", "demand"],
      examples: ["Show me the demand forecast", "What's the trend?"],
      responses: ["Generating forecast...", "Analyzing trends..."],
      requiredEntities: [],
      optionalEntities: []
    },
    {
      intent: "maintenance_request",
      patterns: ["maintenance", "repair", "fix", "broken"],
      examples: ["EQ004 needs maintenance", "The grader is broken"],
      responses: ["Creating maintenance request...", "Scheduling repair..."],
      requiredEntities: [],
      optionalEntities: ["equipmentId", "priority"]
    },
    {
      intent: "cost_analysis",
      patterns: ["cost", "price", "budget", "expense"],
      examples: ["What's the cost?", "Show me the budget"],
      responses: ["Calculating costs...", "Generating cost report..."],
      requiredEntities: [],
      optionalEntities: ["duration", "equipmentType"]
    }
  ]
  
  // Add language-specific patterns
  const languagePatterns = getLanguageSpecificPatterns(language)
  return [...basePatterns, ...languagePatterns]
}

function getLanguageSpecificPatterns(language: string): IntentPattern[] {
  switch (language) {
    case "es":
      return [
        {
          intent: "check_status",
          patterns: ["estado", "condición", "cómo está"],
          examples: ["¿Cuál es el estado de EQ001?"],
          responses: ["Verificando estado del equipo..."],
          requiredEntities: [],
          optionalEntities: ["equipmentId"]
        }
      ]
    case "fr":
      return [
        {
          intent: "check_status",
          patterns: ["statut", "état", "comment va"],
          examples: ["Quel est le statut de EQ001?"],
          responses: ["Vérification du statut..."],
          requiredEntities: [],
          optionalEntities: ["equipmentId"]
        }
      ]
    case "hi":
      return [
        {
          intent: "check_status",
          patterns: ["स्थिति", "हालत", "कैसा है"],
          examples: ["EQ001 की स्थिति क्या है?"],
          responses: ["उपकरण की स्थिति जांच रहा हूं..."],
          requiredEntities: [],
          optionalEntities: ["equipmentId"]
        }
      ]
    default:
      return []
  }
}

function getKeywordMap(language: string): Record<string, string[]> {
  const baseKeywords: Record<string, string[]> = {
    check_status: ["status", "condition", "how", "what"],
    check_out: ["check", "out", "rent", "borrow", "need"],
    check_in: ["check", "in", "return", "bring", "back"],
    find_available: ["available", "free", "show", "find", "search"],
    forecast_demand: ["forecast", "predict", "trend", "demand"],
    maintenance_request: ["maintenance", "repair", "fix", "broken"],
    cost_analysis: ["cost", "price", "budget", "expense"]
  }
  
  // Add language-specific keywords
  const languageKeywords = getLanguageSpecificKeywords(language)
  return { ...baseKeywords, ...languageKeywords }
}

function getLanguageSpecificKeywords(language: string): Record<string, string[]> {
  switch (language) {
    case "es":
      return {
        check_status: ["estado", "condición"],
        check_out: ["alquilar", "necesito"],
        check_in: ["devolver", "regresar"]
      }
    case "fr":
      return {
        check_status: ["statut", "état"],
        check_out: ["louer", "j'ai besoin"],
        check_in: ["retourner", "rapporter"]
      }
    case "hi":
      return {
        check_status: ["स्थिति", "हालत"],
        check_out: ["चेक आउट", "जरूरत"],
        check_in: ["वापस", "लौटाना"]
      }
    default:
      return {}
  }
}

function getEntityIntentMap(language: string): Record<string, string[]> {
  return {
    check_status: ["equipmentId"],
    check_out: ["equipmentId", "duration", "durationUnit"],
    check_in: ["equipmentId"],
    find_available: ["equipmentType", "siteId"],
    maintenance_request: ["equipmentId", "priority"],
    cost_analysis: ["duration", "equipmentType"]
  }
}

function getContextKeywords(language: string): Record<string, string[]> {
  return {
    equipment_management: ["equipment", "machine", "tool"],
    project_planning: ["project", "schedule", "timeline"],
    maintenance: ["maintenance", "repair", "service"],
    cost_management: ["cost", "budget", "expense"],
    safety: ["safety", "secure", "protect"]
  }
}

function getPositiveWords(language: string): string[] {
  const basePositive = ["good", "great", "excellent", "perfect", "working", "available", "ready"]
  
  switch (language) {
    case "es":
      return [...basePositive, "bueno", "excelente", "perfecto", "funcionando"]
    case "fr":
      return [...basePositive, "bon", "excellent", "parfait", "fonctionne"]
    case "hi":
      return [...basePositive, "अच्छा", "बढ़िया", "काम कर रहा"]
    default:
      return basePositive
  }
}

function getNegativeWords(language: string): string[] {
  const baseNegative = ["bad", "broken", "problem", "issue", "down", "unavailable", "maintenance"]
  
  switch (language) {
    case "es":
      return [...baseNegative, "malo", "roto", "problema", "averiado"]
    case "fr":
      return [...baseNegative, "mauvais", "cassé", "problème", "en panne"]
    case "hi":
      return [...baseNegative, "बुरा", "टूटा", "समस्या", "खराब"]
    default:
      return baseNegative
  }
}

// Legacy function for backward compatibility
export function parseVoiceCommandLegacy(text: string, language = "auto"): VoiceIntent {
  const enhanced = parseVoiceCommand(text, language)
  return {
    intent: enhanced.intent,
    language: enhanced.language,
    confidence: enhanced.confidence,
    entities: enhanced.entities
  }
}


