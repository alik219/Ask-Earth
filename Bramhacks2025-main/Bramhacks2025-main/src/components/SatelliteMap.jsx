import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icons based on severity
const createCustomIcon = (severity) => {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    default: '#3b82f6'
  }
  
  const color = colors[severity] || colors.default
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
}

// Component to handle map updates
function MapController({ locations, selectedLocation, center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    if (center && zoom) {
      // If explicit center and zoom provided (e.g., for Near Me)
      map.flyTo([center.lat, center.lng], zoom, {
        duration: 2
      })
    } else if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 8, {
        duration: 2
      })
    } else if (locations.length > 0) {
      // Fit bounds to show all markers
      const bounds = locations.map(loc => [loc.lat, loc.lng])
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 })
      }
    }
  }, [locations, selectedLocation, center, zoom, map])
  
  return null
}

export default function SatelliteMap({ locations, onLocationClick, selectedLocation, center, zoom }) {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        {/* Google Satellite Imagery */}
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google</a>'
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        
        {/* Google Hybrid Labels (roads, places) */}
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/maps">Google</a>'
          url="https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"
          maxZoom={20}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        
        {/* Location Markers */}
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.severity)}
            eventHandlers={{
              click: () => onLocationClick(location)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                <p className="text-sm mb-2">{location.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded font-semibold ${
                    location.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    location.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    location.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {location.severity}
                  </span>
                  {location.source && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {location.source}
                    </span>
                  )}
                </div>
                {location.magnitude && (
                  <p className="text-xs mt-2"><strong>Magnitude:</strong> {location.magnitude}</p>
                )}
                {location.pollutant && (
                  <p className="text-xs mt-2">
                    <strong>{location.pollutant}:</strong> {location.value} {location.unit}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapController locations={locations} selectedLocation={selectedLocation} center={center} zoom={zoom} />
      </MapContainer>
    </div>
  )
}
