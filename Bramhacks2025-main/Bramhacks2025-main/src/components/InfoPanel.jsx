import { useState } from 'react'
import { X, Lightbulb } from 'lucide-react'

export default function InfoPanel({ aiResponse, isLoading, onClose }) {
  const [isMinimized, setIsMinimized] = useState(false)
  
  return (
    <div className="w-full max-h-[calc(100vh-10rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white flex-1 min-w-0">
          <Lightbulb className="w-5 h-5 flex-shrink-0" />
          <h2 className="font-semibold text-lg truncate">Earth's Response</h2>
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
      <div className="p-6 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Analyzing environmental data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {aiResponse}
              </p>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                  💡 Click on the markers on the globe to learn more about specific locations
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-700 font-medium mb-1">📡 Real-Time Data Sources:</p>
                <p className="text-xs text-green-600">
                  NASA EONET • USGS Earthquakes • OpenAQ Air Quality • World Bank Climate Data
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
