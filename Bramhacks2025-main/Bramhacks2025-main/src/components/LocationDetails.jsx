import { useState } from 'react'
import { X, MapPin, AlertTriangle, Info, Sparkles, Loader2 } from 'lucide-react'
import { getLocationInsights } from '../services/geminiService'

export default function LocationDetails({ location, onClose }) {
  const [insights, setInsights] = useState(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getSeverityIcon = (severity) => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertTriangle className="w-5 h-5" />
    }
    return <Info className="w-5 h-5" />
  }

  const handleGetInsights = async () => {
    setIsLoadingInsights(true)
    try {
      const result = await getLocationInsights(location)
      setInsights(result)
    } catch (error) {
      console.error('Error fetching insights:', error)
      setInsights('Unable to fetch insights at this time. Please try again.')
    } finally {
      setIsLoadingInsights(false)
    }
  }

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white flex-1 min-w-0">
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <h2 className="font-semibold text-lg truncate">
            {isMinimized ? location.name : 'Location Details'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
      <div className="p-6 space-y-4">
        {/* Satellite Image Preview - Using Mapbox static API */}
        <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <div className="relative w-full h-48 bg-gradient-to-br from-blue-900 to-green-900">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sca!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Satellite view of ${location.name}`}
            />
          </div>
          <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600 flex items-center justify-between">
            <span>📡 Satellite View</span>
            <span className="text-blue-600 font-semibold">{location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°</span>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{location.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-2 flex-wrap">
            <span>📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
            {location.source && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                {location.source}
              </span>
            )}
          </p>
        </div>
        
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${getSeverityColor(location.severity)}`}>
          {getSeverityIcon(location.severity)}
          <div>
            <div className="font-semibold capitalize mb-1">
              {location.severity} Severity Level
            </div>
            <p className="text-sm opacity-90">
              {location.description}
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          {!insights ? (
            <div className="text-center">
              <button
                onClick={handleGetInsights}
                disabled={isLoadingInsights}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isLoadingInsights ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Getting Updated Info...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Get Updated Info & News</span>
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Click to get AI-powered personalized insights about this location
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Updated Insights
                </h4>
                <button
                  onClick={() => setInsights(null)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  ✕ Close
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="prose prose-sm max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {insights}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
