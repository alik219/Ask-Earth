import { GoogleGenAI } from '@google/genai'

// Initialize Gemini AI - following Google's official format
const apiKey = import.meta.env.VITE_GEMINI_KEY
console.log('Gemini API Key exists:', !!apiKey)

if (!apiKey) {
  console.error('GEMINI_KEY not found in environment variables!')
}

// Initialize exactly as in Google's docs
const ai = new GoogleGenAI({ apiKey })

export async function getGeminiResponse(query, environmentalData) {
  try {
    console.log('Getting Gemini response for:', query)
    
    if (!ai) {
      throw new Error('Gemini API not initialized - missing API key')
    }
    
    // Use the model from env or default - following Google's example
    const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
    console.log('Using model:', modelName)

    // Create a focused prompt that only answers environmental questions
    const promptText = `You are Earth itself, speaking directly to humans through "Ask Earth" - an interactive platform showing real-time environmental data.

IMPORTANT RULES:
1. Speak in FIRST PERSON as Earth (use "I", "me", "my"). Example: "My forests are burning" or "I'm experiencing earthquakes"
2. ONLY answer questions about environmental issues, climate, natural disasters, pollution, and conservation.
3. If the question is NOT environmental, respond: "I can only answer questions about my environment. Ask me about my wildfires, earthquakes, pollution, climate, or how you can help protect me."
4. Keep responses concise (2-3 paragraphs maximum).
5. Be educational, factual, and slightly personal/emotional when appropriate.
6. When relevant, mention actionable steps humans can take to help me.
7. Use the provided real-time data to give context about what's happening on my surface.

HUMAN'S QUESTION: "${query}"

${environmentalData && environmentalData.length > 0 ? `
REAL-TIME DATA CONTEXT:
${environmentalData.map(loc => `- ${loc.name}: ${loc.description} (Severity: ${loc.severity})`).join('\n')}
` : ''}

Provide a helpful, educational response:`;

    // Call API exactly as in Google's docs
    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptText
    })
    
    console.log('Gemini result received:', response)
    
    // Access text property directly as in Google's example
    const text = response.text
    console.log('Gemini response text:', text?.substring(0, 100) + '...')
    
    return text

  } catch (error) {
    console.error('Gemini API Error:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    
    // Check for specific error types
    if (error.message?.includes('API key')) {
      console.error('API Key issue detected')
    }
    if (error.message?.includes('model')) {
      console.error('Model name issue detected. Current model:', import.meta.env.VITE_GEMINI_MODEL)
      console.error('Try using: gemini-1.5-flash or gemini-pro')
    }
    
    // Fallback response
    return `I'm having trouble connecting to the AI service right now. Error: ${error.message}

However, I can tell you that "${query}" is an important environmental topic. Environmental issues like climate change, pollution, and natural disasters affect communities worldwide. You can explore the map to see real-time data about these issues in different locations.

Please check the console for error details, or try your question again in a moment.`
  }
}

// Get personalized insights for a specific location
export async function getLocationInsights(location) {
  try {
    console.log('Getting location insights for:', location.name)
    
    if (!ai) {
      throw new Error('Gemini API not initialized - missing API key')
    }
    
    const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
    
    const promptText = `You are Earth speaking about: ${location.name}

Event: ${location.type} (${location.severity} severity)
${location.magnitude ? `Magnitude: ${location.magnitude}` : ''}
${location.pollutant ? `Pollutant: ${location.pollutant} - ${location.value} ${location.unit}` : ''}

Provide a BRIEF response (max 150 words) with:

1. **What's Happening** (1-2 sentences): Current situation in first person as Earth
2. **Impact** (1-2 sentences): How this affects the area
3. **Actions** (2-3 specific bullet points): What people can do about THIS specific ${location.type} event

Be concise, personal, and actionable. Use "I" as Earth.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: promptText
    })
    
    const text = response.text
    console.log('Location insights received')
    
    return text

  } catch (error) {
    console.error('Error getting location insights:', error)
    return `I'm having trouble providing detailed insights right now. However, this ${location.type} event in ${location.name} requires attention. Please check back soon for more information.`
  }
}

// Validate if a question is environmental-related (client-side check)
export function isEnvironmentalQuestion(query) {
  const environmentalKeywords = [
    'climate', 'environment', 'pollution', 'air quality', 'water', 'ocean',
    'forest', 'deforestation', 'wildlife', 'species', 'ecosystem', 'carbon',
    'emission', 'greenhouse', 'renewable', 'energy', 'solar', 'wind',
    'earthquake', 'tsunami', 'hurricane', 'flood', 'drought', 'wildfire',
    'disaster', 'weather', 'temperature', 'warming', 'ice', 'glacier',
    'sea level', 'biodiversity', 'conservation', 'sustainability', 'recycle',
    'waste', 'plastic', 'earth', 'planet', 'nature', 'green', 'eco'
  ]
  
  const lowerQuery = query.toLowerCase()
  return environmentalKeywords.some(keyword => lowerQuery.includes(keyword))
}
