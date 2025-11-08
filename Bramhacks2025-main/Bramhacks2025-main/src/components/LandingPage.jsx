import { Satellite, Globe, Sparkles, TrendingUp, MapPin, ArrowRight } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 via-green-800 to-blue-900 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-float">
                <Globe className="w-14 h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Ask Earth
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-blue-100 mb-4 animate-fade-in animation-delay-200">
            Ask Me Anything About My Environment
          </p>
          
          {/* Description */}
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto animate-fade-in animation-delay-400">
            I'm Earth, and I'm here to answer your questions about my environment. 
            Ask me about wildfires burning on my surface, earthquakes shaking my crust, 
            pollution in my atmosphere, and how you can help protect me.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in animation-delay-600">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <Satellite className="w-10 h-10 text-green-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Real Satellite Data</h3>
              <p className="text-blue-200 text-sm">High-resolution imagery from Google Maps</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <TrendingUp className="w-10 h-10 text-blue-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Live From My Surface</h3>
              <p className="text-blue-200 text-sm">Real-time data from NASA, USGS, OpenAQ</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
              <MapPin className="w-10 h-10 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Explore My Locations</h3>
              <p className="text-blue-200 text-sm">Click markers to see what's happening</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-green-400 to-blue-500 text-white px-10 py-5 rounded-full text-xl font-bold hover:from-green-500 hover:to-blue-600 transition-all shadow-2xl hover:shadow-3xl hover:scale-105 flex items-center gap-3 mx-auto animate-fade-in animation-delay-800"
          >
            Start Asking Earth
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Footer note */}
          <p className="text-blue-300 text-sm mt-8 animate-fade-in animation-delay-1000">
            Real-time data from my surface • Ask me anything about my environment
          </p>
        </div>
      </div>
    </div>
  )
}
