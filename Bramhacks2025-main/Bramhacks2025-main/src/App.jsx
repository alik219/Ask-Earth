import { useState } from 'react'
import LandingPage from './components/LandingPage'
import SatelliteMap from './components/SatelliteMap'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import LocationDetails from './components/LocationDetails'
import { Search, Satellite, MapPin } from 'lucide-react'
import { getEnhancedAIResponse, getBramptonData } from './services/environmentalData'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [locations, setLocations] = useState([])
  const [aiResponse, setAiResponse] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)
  const [mapZoom, setMapZoom] = useState(null)

  const handleSearch = async (query) => {
    console.log('Search query:', query)
    setIsLoading(true)
    setShowInfo(true)
    setSelectedLocation(null)
    setMapCenter(null) // Reset map center
    setMapZoom(null) // Reset map zoom
    
    try {
      // Get real environmental data from APIs
      const result = await getEnhancedAIResponse(query)
      console.log('API Response:', result)
      
      setAiResponse(result.response)
      setLocations(result.locations)
    } catch (error) {
      console.error('Error fetching environmental data:', error)
      setAiResponse('Sorry, there was an error fetching real-time data. Please check your connection and try again.')
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
  }

  const handleNearMe = async () => {
    console.log('Near Me clicked - loading Brampton data')
    setIsLoading(true)
    setShowInfo(true)
    setSelectedLocation(null)
    
    try {
      const result = await getBramptonData()
      console.log('Brampton data:', result)
      
      setAiResponse(result.response)
      setLocations(result.locations)
      setMapCenter(result.center) // Set Brampton center
      setMapZoom(result.zoom) // Set zoom level
    } catch (error) {
      console.error('Error fetching Brampton data:', error)
      setAiResponse('Sorry, there was an error fetching local data.')
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header - Compact */}
      <div className="absolute top-0 left-0 right-0 z-[1000] pointer-events-none">
        <div className="px-4 py-3">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 truncate">Ask Earth</h1>
                  <p className="text-xs text-gray-600 truncate">Ask me anything about my environment</p>
                </div>
                <button
                  onClick={handleNearMe}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Near Me</span>
                </button>
              </div>
              
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* Satellite Map with Real Imagery */}
      <SatelliteMap 
        locations={locations} 
        onLocationClick={handleLocationClick}
        selectedLocation={selectedLocation}
        center={mapCenter}
        zoom={mapZoom}
      />

      {/* Info Panel - Right Side */}
      {showInfo && (
        <div className="absolute top-44 right-4 w-96 max-w-[calc(100vw-2rem)] z-[999]">
          <InfoPanel 
            aiResponse={aiResponse} 
            isLoading={isLoading}
            onClose={() => setShowInfo(false)}
          />
        </div>
      )}

      {/* Location Details - Bottom Left */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 w-96 max-w-[calc(100vw-2rem)] z-[999]">
          <LocationDetails 
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}

      {/* Instructions */}
      {!showInfo && locations.length === 0 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[998]">
          <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 border border-gray-200 shadow-lg">
            <p className="text-gray-700 text-sm flex items-center gap-2">
              <Search className="w-4 h-4" />
              Ask Earth about wildfires, earthquakes, pollution, climate change, and more
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


export default App
