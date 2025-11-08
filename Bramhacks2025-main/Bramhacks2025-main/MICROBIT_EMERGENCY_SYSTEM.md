# Microbit Emergency System Integration

## Overview
This document explains how the **Microbit Radio Emergency System** integrates with the Ask Earth platform to provide offline emergency assistance in remote locations during natural disasters.

## The Problem
In remote locations affected by natural disasters (earthquakes, floods, wildfires, hurricanes), traditional internet infrastructure often fails, leaving people unable to:
- Contact emergency services
- Locate nearby safe havens/shelters
- Receive critical safety information
- Coordinate with rescue teams

## The Solution: Microbit Radio Network

### Hardware Components
1. **BBC micro:bit devices** - Low-cost, battery-powered microcontrollers with built-in radio capabilities
2. **Radio frequency**: 2.4 GHz (similar to Bluetooth but with longer range ~70m in open areas)
3. **Power**: Battery-powered (can last days/weeks on AA batteries)
4. **Deployment**: Pre-positioned at safe hubs, shelters, and emergency response centers

### How It Works

#### 1. Network Architecture
```
[User's Microbit] <--Radio--> [Hub Microbit] <--Satellite Link--> [Ask Earth Platform]
                                    |
                              [Emergency Services]
                              [Safe Hub Database]
```

#### 2. User Device (Microbit in Emergency Mode)
- **Button A**: Send SOS signal with GPS coordinates (if available)
- **Button B**: Request nearest safe hub locations
- **Radio Broadcast**: Continuously listens for emergency broadcasts
- **Display**: Shows direction arrows to nearest safe hub
- **LED Matrix**: Displays distance and status messages

#### 3. Hub Microbit (Stationed at Safe Locations)
- **Receives**: Emergency signals from users within radio range (~70m radius)
- **Transmits**: Location data, safety instructions, and shelter information
- **Satellite Uplink**: Connected to satellite modem for internet-independent communication
- **Power**: Solar-powered with battery backup
- **Coverage**: Each hub creates a ~140m diameter coverage zone

#### 4. Satellite Integration
Since internet is unavailable, we use **satellite communication**:
- **Iridium/Globalstar satellite network** for data transmission
- **Low-bandwidth protocol**: Optimized for minimal data transfer
- **Message format**: Compressed JSON with coordinates, status, and request type
- **Latency**: 10-30 seconds for message round-trip

### Integration with Ask Earth Platform

#### Phase 1: Pre-Disaster Preparation
```javascript
// Safe hub locations are pre-loaded into the system
const safeHubs = [
  {
    id: "hub_001",
    name: "Community Center - Main St",
    lat: 43.7315,
    lng: -79.7624,
    capacity: 500,
    resources: ["water", "medical", "food", "shelter"],
    microbitId: "MB_001"
  },
  // ... more hubs
]
```

#### Phase 2: Emergency Detection
When Ask Earth detects a natural disaster (via NASA EONET, USGS, etc.):
1. System automatically switches affected region to "Emergency Mode"
2. Activates microbit network in the disaster zone
3. Pushes safe hub data to all hub microbits via satellite

#### Phase 3: User Interaction Flow

**Scenario: User needs help during earthquake**

1. **User presses Button A on their microbit**
   ```
   Microbit sends: {type: "SOS", lat: 43.73, lng: -79.76, time: timestamp}
   ```

2. **Nearest Hub Microbit receives signal**
   - Logs the SOS request
   - Calculates distance to all safe hubs
   - Sends back response via radio

3. **Hub sends to satellite**
   ```json
   {
     "type": "emergency_sos",
     "user_location": {"lat": 43.73, "lng": -79.76},
     "hub_id": "MB_001",
     "timestamp": "2025-11-08T12:22:00Z"
   }
   ```

4. **Satellite relays to Ask Earth platform**
   - Platform logs emergency request
   - Notifies local authorities
   - Updates real-time emergency map
   - Sends back nearest safe hub data

5. **Response sent back through satellite → Hub → User**
   ```
   User's microbit displays:
   "→ SHELTER 0.8km NORTH"
   "COMMUNITY CENTER"
   "CAPACITY: 234/500"
   ```

#### Phase 4: Real-Time Coordination

**Ask Earth Dashboard shows:**
- All active SOS signals on the map
- Safe hub capacity and resources
- Microbit network coverage zones
- Emergency responder locations

### Technical Implementation

#### New Service: `microbitService.js`
```javascript
// Handles microbit communication protocol
export async function processMicrobitEmergency(data) {
  const { user_location, hub_id, type } = data
  
  // Find nearest safe hubs
  const nearbyHubs = findNearestSafeHubs(user_location, 5)
  
  // Notify emergency services
  await notifyEmergencyServices({
    location: user_location,
    type: type,
    urgency: "critical"
  })
  
  // Return response for satellite transmission
  return {
    safe_hubs: nearbyHubs,
    instructions: getEmergencyInstructions(type),
    estimated_response_time: calculateResponseTime(user_location)
  }
}
```

#### New Component: `EmergencyMode.jsx`
```javascript
// UI overlay when disaster is detected in user's region
export default function EmergencyMode({ disaster, userLocation }) {
  return (
    <div className="emergency-overlay">
      <div className="alert-banner">
        ⚠️ EMERGENCY MODE ACTIVE: {disaster.type}
      </div>
      
      <div className="safe-hubs-panel">
        <h2>Nearest Safe Hubs</h2>
        {safeHubs.map(hub => (
          <SafeHubCard 
            hub={hub}
            distance={calculateDistance(userLocation, hub)}
            microbitActive={hub.microbitStatus === 'active'}
          />
        ))}
      </div>
      
      <div className="microbit-instructions">
        <h3>Using Your Microbit Device</h3>
        <ul>
          <li>Button A: Send SOS signal</li>
          <li>Button B: Get safe hub directions</li>
          <li>Follow arrow on display to nearest shelter</li>
        </ul>
      </div>
    </div>
  )
}
```

### Data Flow Diagram

```
┌─────────────────┐
│  Natural        │
│  Disaster       │
│  Detected       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│  Ask Earth      │◄────►│  Satellite       │
│  Platform       │      │  Network         │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         │                        ▼
         │               ┌──────────────────┐
         │               │  Hub Microbit    │
         │               │  (at safe hub)   │
         │               └────────┬─────────┘
         │                        │ Radio
         │                        ▼
         │               ┌──────────────────┐
         └──────────────►│  User Microbit   │
                         │  (in field)      │
                         └──────────────────┘
```

### Benefits

1. **Works Without Internet**: Radio + satellite communication
2. **Low Power**: Microbits can run for weeks on batteries
3. **Affordable**: ~$15 per microbit device
4. **Easy to Deploy**: Pre-position at schools, community centers, hospitals
5. **Scalable**: Each hub covers ~140m diameter, can mesh network
6. **Real-Time**: Satellite latency is only 10-30 seconds
7. **Bidirectional**: Users can request help AND receive instructions

### Implementation Roadmap

#### Phase 1: Foundation (Current)
- ✅ Ask Earth platform with real-time disaster data
- ✅ Satellite map visualization
- ✅ Location-based environmental data

#### Phase 2: Microbit Integration (Next)
- [ ] Create microbit firmware for user devices
- [ ] Create microbit firmware for hub devices
- [ ] Set up satellite communication protocol
- [ ] Build emergency mode UI in Ask Earth
- [ ] Create safe hub database

#### Phase 3: Testing & Deployment
- [ ] Test radio range in various conditions
- [ ] Simulate disaster scenarios
- [ ] Deploy pilot program in disaster-prone region
- [ ] Train community members on microbit usage

#### Phase 4: Advanced Features
- [ ] Mesh networking between microbits
- [ ] Voice messages via audio modules
- [ ] Integration with local emergency services
- [ ] Predictive safe hub recommendations using AI

### Hardware Setup Example

**User Microbit Code (Simplified)**
```python
from microbit import *
import radio

radio.on()
radio.config(channel=7, power=7)  # Max power for range

while True:
    if button_a.was_pressed():
        # Send SOS
        radio.send("SOS:43.7315:-79.7624")
        display.show(Image.HEART)
    
    if button_b.was_pressed():
        # Request safe hub
        radio.send("REQ_HUB:43.7315:-79.7624")
    
    # Listen for responses
    message = radio.receive()
    if message:
        # Parse and display direction to safe hub
        display.show(Image.ARROW_N)  # Example
```

**Hub Microbit Code (Simplified)**
```python
from microbit import *
import radio

radio.on()
radio.config(channel=7, power=7)

safe_hub_location = {"lat": 43.7315, "lng": -79.7624}

while True:
    message = radio.receive()
    if message:
        if "SOS" in message:
            # Forward to satellite uplink
            uart.write(message)
            # Send response back
            radio.send(f"HUB:{safe_hub_location['lat']}:{safe_hub_location['lng']}")
```

### Cost Analysis

**Per Coverage Zone (140m diameter)**
- 1x Hub Microbit: $15
- 1x Satellite modem: $200-500 (one-time)
- Solar panel + battery: $50
- Weatherproof enclosure: $30
- **Total per hub: ~$300-600**

**For 100 users in disaster zone**
- 100x User Microbits: $1,500
- Distribution and training: $500
- **Total: ~$2,000**

**Compare to**: Traditional emergency communication systems cost $50,000-200,000 per installation.

### Conclusion

The Microbit Emergency System transforms Ask Earth from a monitoring platform into a **life-saving emergency response tool**. By combining:
- Real-time disaster detection (NASA, USGS APIs)
- Satellite imagery and mapping
- Offline radio communication (microbits)
- Satellite uplink for internet-independent data
- AI-powered personalized guidance

We create an affordable, scalable solution that works even when all traditional infrastructure fails.

---

## Next Steps for Your Team

1. **Obtain Microbits**: Order 5-10 devices for prototyping
2. **Test Radio Range**: Measure actual range in your environment
3. **Build Prototype**: Create basic SOS → Hub → Response flow
4. **Integrate with Ask Earth**: Add emergency mode UI
5. **Demo**: Show working prototype at hackathon

**Questions?** Check the code examples above or refer to:
- [Microbit Radio Documentation](https://microbit-micropython.readthedocs.io/en/latest/radio.html)
- [Satellite Communication Protocols](https://www.iridium.com/products/iridium-9523/)
