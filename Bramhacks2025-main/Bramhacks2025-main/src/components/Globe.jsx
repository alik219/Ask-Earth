import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'

function Earth({ locations, onLocationClick, selectedLocation }) {
  const earthRef = useRef()
  const cloudsRef = useRef()
  
  // Load real Earth textures from NASA
  const [earthTexture, normalTexture, specularTexture, cloudsTexture] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
  ])
  
  // Auto-rotate the Earth
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0012
    }
  })
  
  return (
    <group>
      {/* Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          map={earthTexture}
          normalMap={normalTexture}
          specularMap={specularTexture}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Clouds */}
      <Sphere ref={cloudsRef} args={[2.01, 64, 64]}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Location markers */}
      {locations.map((location, index) => (
        <LocationMarker
          key={index}
          location={location}
          onClick={() => onLocationClick(location)}
          isSelected={selectedLocation?.name === location.name}
        />
      ))}
    </group>
  )
}

function LocationMarker({ location, onClick, isSelected }) {
  const markerRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  // Convert lat/lng to 3D coordinates
  const position = latLngToVector3(location.lat, location.lng, 2.05)
  
  useFrame((state) => {
    if (markerRef.current && (hovered || isSelected)) {
      markerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444'
      case 'high': return '#f97316'
      case 'medium': return '#eab308'
      case 'low': return '#22c55e'
      default: return '#3b82f6'
    }
  }

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial 
          color={getSeverityColor(location.severity)}
          transparent
          opacity={isSelected ? 1 : 0.9}
        />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshBasicMaterial
          color={getSeverityColor(location.severity)}
          transparent
          opacity={hovered || isSelected ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Label on hover */}
      {(hovered || isSelected) && (
        <Html distanceFactor={8}>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-white/20 pointer-events-none">
            <div className="font-semibold">{location.name}</div>
            <div className="text-xs text-gray-300 mt-1">{location.severity} severity</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function CameraController({ locations }) {
  const { camera } = useThree()
  
  useEffect(() => {
    if (locations.length > 0) {
      // Smoothly adjust camera when new locations appear
      camera.position.lerp(new THREE.Vector3(0, 0, 6), 0.1)
    }
  }, [locations, camera])
  
  return null
}

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  
  return [x, y, z]
}


function LoadingEarth() {
  return (
    <Sphere args={[2, 32, 32]}>
      <meshStandardMaterial color="#1e3a8a" wireframe />
    </Sphere>
  )
}

export default function Globe({ locations, onLocationClick, selectedLocation }) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4da6ff" />
        
        <Suspense fallback={<LoadingEarth />}>
          <Earth 
            locations={locations}
            onLocationClick={onLocationClick}
            selectedLocation={selectedLocation}
          />
        </Suspense>
        
        <CameraController locations={locations} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
