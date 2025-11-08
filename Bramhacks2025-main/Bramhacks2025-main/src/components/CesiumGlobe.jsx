import { useEffect, useRef, useState } from 'react'
import { Viewer, Entity, BillboardGraphics, LabelGraphics } from 'resium'
import { 
  Cartesian3, 
  Color, 
  Ion,
  createWorldImagery,
  IonImageryProvider
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

// Cesium Ion access token (free tier, public token)
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2UyMjcwOS00MDY1LTQxYjEtYjZjMy00YTU0ZTg1YmJjMGEiLCJpZCI6ODE2MSwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1Mjk1ODA4Mn0.dkwAL1CcljUV7NA7fDbhXXnmyZQU_c-G5zRx8PtEcxE'

export default function CesiumGlobe({ locations, onLocationClick, selectedLocation }) {
  const viewerRef = useRef(null)
  const [imageryProvider, setImageryProvider] = useState(null)

  useEffect(() => {
    // Use Cesium World Imagery (satellite imagery)
    const provider = createWorldImagery({
      style: IonImageryProvider.IonWorldImageryStyle.AERIAL
    })
    setImageryProvider(provider)
  }, [])

  useEffect(() => {
    if (viewerRef.current && viewerRef.current.cesiumElement) {
      const viewer = viewerRef.current.cesiumElement
      
      // Configure viewer settings
      viewer.scene.globe.enableLighting = true
      viewer.scene.globe.depthTestAgainstTerrain = false
      
      // Set initial camera position
      if (locations.length > 0 && !selectedLocation) {
        // Fly to show all locations
        const firstLocation = locations[0]
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            firstLocation.lng,
            firstLocation.lat,
            10000000
          ),
          duration: 2
        })
      }
    }
  }, [locations, selectedLocation])

  useEffect(() => {
    if (viewerRef.current && viewerRef.current.cesiumElement && selectedLocation) {
      const viewer = viewerRef.current.cesiumElement
      
      // Fly to selected location with closer view
      viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(
          selectedLocation.lng,
          selectedLocation.lat,
          500000 // Closer zoom for selected location
        ),
        duration: 2
      })
    }
  }, [selectedLocation])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return Color.RED
      case 'high': return Color.ORANGE
      case 'medium': return Color.YELLOW
      case 'low': return Color.GREEN
      default: return Color.BLUE
    }
  }

  return (
    <div className="w-full h-full">
      <Viewer
        ref={viewerRef}
        full
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        infoBox={true}
        selectionIndicator={true}
        imageryProvider={imageryProvider}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Render location markers */}
        {locations.map((location, index) => (
          <Entity
            key={index}
            name={location.name}
            description={`
              <div style="font-family: sans-serif;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af;">${location.name}</h3>
                <p style="margin: 5px 0;"><strong>Severity:</strong> <span style="text-transform: capitalize;">${location.severity}</span></p>
                <p style="margin: 5px 0;">${location.description}</p>
                ${location.source ? `<p style="margin: 5px 0; font-size: 12px; color: #6b7280;"><strong>Source:</strong> ${location.source}</p>` : ''}
                ${location.magnitude ? `<p style="margin: 5px 0;"><strong>Magnitude:</strong> ${location.magnitude}</p>` : ''}
                ${location.pollutant ? `<p style="margin: 5px 0;"><strong>Pollutant:</strong> ${location.pollutant} (${location.value} ${location.unit})</p>` : ''}
              </div>
            `}
            position={Cartesian3.fromDegrees(location.lng, location.lat, 0)}
            onClick={() => onLocationClick(location)}
          >
            <BillboardGraphics
              image={createPinImage(getSeverityColor(location.severity))}
              scale={selectedLocation?.name === location.name ? 1.2 : 0.8}
              verticalOrigin={1}
              heightReference={0}
            />
            <LabelGraphics
              text={location.name}
              font="14px sans-serif"
              fillColor={Color.WHITE}
              outlineColor={Color.BLACK}
              outlineWidth={2}
              style={0}
              verticalOrigin={1}
              pixelOffset={new Cartesian3(0, -50, 0)}
              showBackground={true}
              backgroundColor={Color.fromCssColorString('rgba(0, 0, 0, 0.7)')}
              backgroundPadding={new Cartesian3(8, 4, 8)}
            />
          </Entity>
        ))}
      </Viewer>
    </div>
  )
}

// Create a colored pin marker
function createPinImage(color) {
  const canvas = document.createElement('canvas')
  canvas.width = 48
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  
  // Draw pin shape
  ctx.beginPath()
  ctx.arc(24, 24, 20, 0, Math.PI * 2)
  ctx.fillStyle = color.toCssColorString()
  ctx.fill()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 3
  ctx.stroke()
  
  // Draw pin point
  ctx.beginPath()
  ctx.moveTo(24, 44)
  ctx.lineTo(14, 54)
  ctx.lineTo(34, 54)
  ctx.closePath()
  ctx.fillStyle = color.toCssColorString()
  ctx.fill()
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 2
  ctx.stroke()
  
  // Add inner circle
  ctx.beginPath()
  ctx.arc(24, 24, 8, 0, Math.PI * 2)
  ctx.fillStyle = 'white'
  ctx.fill()
  
  return canvas.toDataURL()
}
