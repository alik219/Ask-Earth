// Environmental Data Service - Integrates real APIs for environmental data
import { getGeminiResponse } from './geminiService'

// Brampton, Ontario coordinates
const BRAMPTON_COORDS = { lat: 43.7315, lng: -79.7624 }

// OpenAQ API - Real-time air quality data (no API key required)
export async function getAirQualityData(lat, lon, radius = 100000) {
  try {
    const response = await fetch(
      `https://api.openaq.org/v2/locations?coordinates=${lat},${lon}&radius=${radius}&limit=10&order_by=lastUpdated&sort=desc`
    )
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error fetching air quality data:', error)
    return []
  }
}

// NASA EONET API - Natural disaster events (no API key required)
export async function getNaturalDisasters() {
  try {
    const response = await fetch(
      'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50'
    )
    const data = await response.json()
    return data.events || []
  } catch (error) {
    console.error('Error fetching disaster data:', error)
    return []
  }
}

// USGS Earthquake API - Real earthquake data (no API key required)
export async function getEarthquakeData(days = 30) {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson`
    )
    const data = await response.json()
    return data.features || []
  } catch (error) {
    console.error('Error fetching earthquake data:', error)
    return []
  }
}

// World Bank Climate API - Climate and environmental indicators
export async function getClimateData(countryCode = 'all') {
  try {
    const response = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/EN.ATM.CO2E.PC?format=json&per_page=100`
    )
    const data = await response.json()
    return data[1] || []
  } catch (error) {
    console.error('Error fetching climate data:', error)
    return []
  }
}

// Process NASA EONET events into location markers
export function processDisasterEvents(events) {
  return events
    .filter(event => event.geometry && event.geometry.length > 0)
    .map(event => {
      const geometry = event.geometry[0]
      const coords = geometry.coordinates
      
      // Determine severity based on event category
      const severity = getSeverityFromCategory(event.categories)
      
      return {
        name: event.title,
        lat: coords[1],
        lng: coords[0],
        description: `${event.categories[0]?.title || 'Natural Event'} - ${event.description || 'Active event'}`,
        severity: severity,
        type: event.categories[0]?.id || 'unknown',
        source: 'NASA EONET',
        date: event.geometry[0].date
      }
    })
}

// Process USGS earthquake data
export function processEarthquakeData(features) {
  return features.map(feature => {
    const props = feature.properties
    const coords = feature.geometry.coordinates
    
    return {
      name: props.place,
      lat: coords[1],
      lng: coords[0],
      description: `Magnitude ${props.mag} earthquake - ${new Date(props.time).toLocaleDateString()}`,
      severity: getMagnitudeSeverity(props.mag),
      type: 'earthquake',
      source: 'USGS',
      magnitude: props.mag,
      date: new Date(props.time).toISOString()
    }
  })
}

// Process OpenAQ air quality data
export function processAirQualityData(locations) {
  return locations.map(location => {
    const latestMeasurement = location.measurements?.[0] || {}
    
    return {
      name: `${location.city || location.name}, ${location.country}`,
      lat: location.coordinates.latitude,
      lng: location.coordinates.longitude,
      description: `Air Quality: ${latestMeasurement.parameter || 'Multiple pollutants'} - Last updated: ${new Date(location.lastUpdated).toLocaleDateString()}`,
      severity: getAirQualitySeverity(latestMeasurement.value, latestMeasurement.parameter),
      type: 'air-pollution',
      source: 'OpenAQ',
      pollutant: latestMeasurement.parameter,
      value: latestMeasurement.value,
      unit: latestMeasurement.unit
    }
  })
}

function getSeverityFromCategory(categories) {
  if (!categories || categories.length === 0) return 'medium'
  
  const category = categories[0].id
  const criticalEvents = ['wildfires', 'volcanoes', 'severeStorms']
  const highEvents = ['floods', 'drought', 'landslides']
  
  if (criticalEvents.includes(category)) return 'critical'
  if (highEvents.includes(category)) return 'high'
  return 'medium'
}

function getMagnitudeSeverity(magnitude) {
  if (magnitude >= 7) return 'critical'
  if (magnitude >= 6) return 'high'
  if (magnitude >= 5) return 'medium'
  return 'low'
}

function getAirQualitySeverity(value, parameter) {
  if (!value) return 'medium'
  
  // PM2.5 standards (μg/m³)
  if (parameter === 'pm25') {
    if (value > 55) return 'critical'
    if (value > 35) return 'high'
    if (value > 12) return 'medium'
    return 'low'
  }
  
  // PM10 standards
  if (parameter === 'pm10') {
    if (value > 150) return 'critical'
    if (value > 100) return 'high'
    if (value > 50) return 'medium'
    return 'low'
  }
  
  return 'medium'
}

// Enhanced AI response with real data integration - FILTERED by query
export async function getEnhancedAIResponse(query) {
  try {
    const lowerQuery = query.toLowerCase()
    let locations = []
    
    // Wildfire specific queries
    if (lowerQuery.includes('wildfire') || lowerQuery.includes('fire')) {
      const disasters = await getNaturalDisasters()
      const wildfires = disasters.filter(event => 
        event.categories.some(cat => cat.id === 'wildfires')
      )
      locations = processDisasterEvents(wildfires.slice(0, 15))
    }
    
    // Earthquake queries - use real USGS data
    else if (lowerQuery.includes('earthquake') || lowerQuery.includes('seismic')) {
      const earthquakeData = await getEarthquakeData()
      locations = processEarthquakeData(earthquakeData.slice(0, 15))
    }
    
    // Air pollution queries - use real OpenAQ data
    else if (lowerQuery.includes('air') || lowerQuery.includes('pollution') || lowerQuery.includes('smog')) {
      const cities = [
        { lat: 28.7041, lon: 77.1025 }, // Delhi
        { lat: 39.9042, lon: 116.4074 }, // Beijing
        { lat: -6.2088, lon: 106.8456 }  // Jakarta
      ]
      
      const airQualityPromises = cities.map(city => getAirQualityData(city.lat, city.lon, 50000))
      const airQualityResults = await Promise.all(airQualityPromises)
      const allLocations = airQualityResults.flat()
      
      locations = processAirQualityData(allLocations.slice(0, 12))
    }
    
    // Flood queries
    else if (lowerQuery.includes('flood')) {
      const disasters = await getNaturalDisasters()
      const floods = disasters.filter(event => 
        event.categories.some(cat => cat.id === 'floods')
      )
      locations = processDisasterEvents(floods.slice(0, 15))
    }
    
    // Storm/Hurricane queries
    else if (lowerQuery.includes('storm') || lowerQuery.includes('hurricane') || lowerQuery.includes('cyclone')) {
      const disasters = await getNaturalDisasters()
      const storms = disasters.filter(event => 
        event.categories.some(cat => cat.id === 'severeStorms' || cat.id === 'storms')
      )
      locations = processDisasterEvents(storms.slice(0, 15))
    }
    
    // Climate change - combine multiple sources
    else if (lowerQuery.includes('climate') || lowerQuery.includes('warming')) {
      const disasters = await getNaturalDisasters()
      locations = processDisasterEvents(disasters.slice(0, 10))
    }
    
    // Default - get a mix of data
    else {
      const [disasters, earthquakes] = await Promise.all([
        getNaturalDisasters(),
        getEarthquakeData()
      ])
      
      locations = [
        ...processDisasterEvents(disasters.slice(0, 5)),
        ...processEarthquakeData(earthquakes.slice(0, 5))
      ]
    }
    
    // Get AI response from Gemini
    const answer = await getGeminiResponse(query, locations)
    
    return {
      response: answer,
      locations: locations.slice(0, 20)
    }
  } catch (error) {
    console.error('Error in getEnhancedAIResponse:', error)
    return {
      response: 'I encountered an error processing your request. Please try again.',
      locations: []
    }
  }
}

// Get environmental data for Brampton, Ontario
export async function getBramptonData() {
  try {
    // Get air quality data for Brampton area
    const airQuality = await getAirQualityData(BRAMPTON_COORDS.lat, BRAMPTON_COORDS.lng, 50000)
    
    // Only show Brampton marker - no other locations
    const locations = [{
      name: 'Brampton, Ontario, Canada',
      lat: BRAMPTON_COORDS.lat,
      lng: BRAMPTON_COORDS.lng,
      description: 'Your location - viewing local environmental data for the Greater Toronto Area',
      severity: 'low',
      source: 'Local Data',
      type: 'location',
      airQuality: airQuality.length > 0 ? airQuality[0] : null
    }]
    
    const prompt = `Provide a detailed environmental overview of Brampton, Ontario, Canada. Include:
1. Current air quality and pollution levels
2. Any recent environmental concerns or news
3. Climate challenges specific to the Greater Toronto Area
4. Local sustainability initiatives
5. Actionable steps residents can take

Keep it concise (2-3 paragraphs) and factual.`
    
    const response = await getGeminiResponse(prompt, locations)
    
    return {
      response,
      locations,
      center: BRAMPTON_COORDS,
      zoom: 12 // Zoom level to see only Brampton
    }
  } catch (error) {
    console.error('Error fetching Brampton data:', error)
    return {
      response: 'Unable to fetch local environmental data at this time.',
      locations: [{
        name: 'Brampton, Ontario',
        lat: BRAMPTON_COORDS.lat,
        lng: BRAMPTON_COORDS.lng,
        description: 'Your location',
        severity: 'low',
        source: 'Local',
        type: 'location'
      }],
      center: BRAMPTON_COORDS
    }
  }
}
