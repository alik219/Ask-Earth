import { useState } from 'react'
import { Search, Sparkles } from 'lucide-react'

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      onSearch(query)
    }
  }

  const suggestions = [
    'Why are wildfires happening?',
    'Where are earthquakes occurring?',
    'How is my air quality?'
  ]

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask Earth a question..."
            className="w-full px-4 py-3 pl-11 pr-24 text-sm bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all placeholder:text-gray-400"
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Loading...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Ask</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Quick suggestions - Compact */}
      {!query && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full border border-gray-200 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
