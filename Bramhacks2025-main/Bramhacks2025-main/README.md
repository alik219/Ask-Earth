# 🌍 Earth Learning - Interactive Sustainability Explorer

An immersive web application that combines a 3D spinning globe with AI-powered insights to help users learn about environmental issues and sustainability solutions.

## ✨ Features

- **Interactive Satellite Map**: Real satellite imagery from ESRI World Imagery powered by Leaflet
- **Real-Time Environmental Data**: Live data from NASA EONET, USGS, OpenAQ, and World Bank APIs
- **Natural Disaster Tracking**: Real-time earthquakes, wildfires, floods, and severe storms
- **Air Quality Monitoring**: Current pollution levels from monitoring stations worldwide
- **Location Markers**: Visual indicators showing where environmental issues occur globally with severity levels
- **Detailed Information**: Click on markers to learn about specific locations and their challenges
- **Sustainability Solutions**: Get actionable advice on how to address environmental problems
- **Modern UI**: Clean, responsive design with smooth animations and intuitive interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd /Users/fersi/IdeaProjects/Bramhacks3
```

2. Install dependencies:
```bash
npm install
```

3. **No API keys required!** The app uses free, public APIs:
   - NASA EONET (Earth Observatory Natural Event Tracker)
   - USGS Earthquake API
   - OpenAQ Air Quality API
   - World Bank Climate Data API

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🎮 How to Use

1. **Ask Questions**: Use the search bar to ask about environmental topics:
   - "What causes air pollution in cities?"
   - "How can we solve water scarcity?"
   - "Where do earthquakes happen most?"
   - "How to prevent deforestation?"

2. **Explore the Globe**: 
   - Rotate the globe by clicking and dragging
   - Zoom in/out using your mouse wheel
   - Watch as location markers appear based on your query

3. **Learn About Locations**:
   - Click on any marker to see detailed information
   - Learn about severity levels and local impacts
   - Discover actionable solutions you can support

4. **Get AI Insights**:
   - Read sustainability recommendations in the info panel
   - Learn about global solutions to environmental challenges

## 🛠️ Technology Stack

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Cesium** - Advanced 3D geospatial visualization platform
- **Resium** - React components for Cesium
- **Cesium Ion** - High-resolution satellite imagery and terrain data
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Real-Time APIs**:
  - NASA EONET - Natural disaster tracking
  - USGS - Earthquake data
  - OpenAQ - Air quality monitoring
  - World Bank - Climate indicators

## 📁 Project Structure

```
Bramhacks3/
├── src/
│   ├── components/
│   │   ├── CesiumGlobe.jsx     # 3D Earth with satellite imagery
│   │   ├── SearchBar.jsx       # Search interface
│   │   ├── InfoPanel.jsx       # AI response display
│   │   └── LocationDetails.jsx # Location information
│   ├── services/
│   │   └── environmentalData.js # Real-time API integrations
│   ├── App.jsx                 # Main application
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── public/
│   └── cesium-setup.js        # Cesium configuration
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🌱 Environmental Topics Covered

- **Natural Disasters**: Earthquakes, hurricanes, floods
- **Water Scarcity**: Drought, water stress, conservation
- **Air Pollution**: Smog, emissions, air quality
- **Climate Change**: Global warming, carbon emissions
- **Deforestation**: Forest loss, biodiversity threats
- **And more**: Ask about any environmental topic!

## 🎨 Features in Detail

### 3D Globe Visualization
- **Real satellite imagery** from Cesium Ion
- High-resolution terrain and imagery data
- Smooth camera controls and navigation
- Interactive location markers with severity indicators
- Click on locations to see detailed satellite views

### Smart Location Markers
- Color-coded by severity (critical, high, medium, low)
- Pulsing animations for emphasis
- Hover tooltips with quick info
- Click to expand full details
- Shows data source (NASA, USGS, OpenAQ, etc.)

### Real-Time Data Integration
- **NASA EONET**: Active wildfires, storms, floods, volcanoes
- **USGS**: Earthquakes magnitude 4.5+ from the past month
- **OpenAQ**: Current air quality measurements from global stations
- **World Bank**: Climate and environmental indicators
- All data updates automatically from public APIs
- No API keys or authentication required

## 🔧 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📝 License

This project is created for educational purposes as part of BramHacks3.

## 🤝 Contributing

This is a hackathon project, but suggestions and improvements are welcome!

## 🌟 Acknowledgments

- Three.js community for amazing 3D graphics tools
- React Three Fiber for seamless React integration
- Environmental organizations for raising awareness
- All contributors to open-source sustainability data

---

**Made with 💚 for a sustainable future**
