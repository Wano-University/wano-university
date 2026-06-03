import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Thermometer, 
  Zap, 
  Wind, 
  Users, 
  Layers, 
  Wrench, 
  Settings, 
  Filter, 
  Power, 
  AlertTriangle 
} from 'lucide-react';

import { 
  getSensorsByFloorAPI, 
  registerSensorAPI, 
  updateSensorStatusAPI 
} from '../lib/sensor.js'; 

const bounds = [[0, 0], [1100, 2000]];

const getSensorIcon = (type, isActive) => {
  let colorVar = 'var(--foreground)';
  let iconHtml = '';
  const activeClass = isActive ? '' : 'opacity-40 grayscale';

  switch (type) {
    case 'TEMPERATURE':
      colorVar = 'var(--fire-color)';
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`;
      break;
    case 'ENERGY_CONSUMPTION':
      colorVar = 'var(--nika-color)';
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
      break;
    case 'AIR_QUALITY':
      colorVar = 'var(--tanuki-color)';
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      break;
    case 'OCCUPANCY':
      colorVar = 'var(--swordsman-color)';
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
      break;
    default:
      break;
  }

  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md transition-all ${activeClass}" style="background-color: ${colorVar}; color: white;">
        ${iconHtml}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14]
  });
};

export default function InteractiveMap() {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState('FLOOR_1');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  
  const [clickedCoords, setClickedCoords] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Updated state to use 'space' instead of 'resourceId'
  const [formData, setFormData] = useState({
    type: 'TEMPERATURE',
    space: '',
    alertLimit: ''
  });

  const fetchSensors = async () => {
    try {
      const data = await getSensorsByFloorAPI(currentFloor);
      setSensors(data);
    } catch (error) {
      console.error("API error, loading local mock baseline layout data:", error);
      // Fallback data updated to use 'space' strings
      setSensors([
        { id: 1, type: 'TEMPERATURE', space: 'Student Training Room', alertLimit: 30, isActive: true, xCoordinates: 200, yCoordinates: 620, floor: 'FLOOR_1' },
        { id: 2, type: 'AIR_QUALITY', space: 'Contemplation Garden', alertLimit: 120, isActive: true, xCoordinates: 500, yCoordinates: 780, floor: 'FLOOR_1' },
        { id: 3, type: 'ENERGY_CONSUMPTION', space: 'Main Grid Breaker', alertLimit: 500, isActive: false, xCoordinates: 800, yCoordinates: 400, floor: 'FLOOR_1' },
        { id: 4, type: 'OCCUPANCY', space: 'Dojo Main Hall', alertLimit: 60, isActive: true, xCoordinates: 450, yCoordinates: 300, floor: 'FLOOR_2' }
      ]);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, [currentFloor]);

  useEffect(() => {
    let result = sensors.filter(s => (s.floor || 'FLOOR_1') === currentFloor);
    if (selectedTypeFilter !== 'ALL') {
      result = result.filter(s => s.type === selectedTypeFilter);
    }
    setFilteredSensors(result);
  }, [sensors, currentFloor, selectedTypeFilter]);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await updateSensorStatusAPI(id, !currentStatus);
      setSensors(sensors.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    } catch (err) {
      console.warn("Backend update down, fallback to tracking state modifications locally:", err);
      setSensors(sensors.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    }
  };

  const handleRegisterSensor = async (e) => {
    e.preventDefault();
    
    // Payload now correctly utilizes the 'space' string for Prisma
    const newSensorPayload = {
      type: formData.type,
      floor: currentFloor,
      space: formData.space,
      alertLimit: parseFloat(formData.alertLimit) || 0,
      isActive: true,
      xCoordinates: clickedCoords.x,
      yCoordinates: clickedCoords.y,
    };

    try {
      const savedSensor = await registerSensorAPI(newSensorPayload);
      setSensors([...sensors, savedSensor]);
    } catch (err) {
      console.warn("Backend registration down, performing local layout creation state patch:", err);
      setSensors([...sensors, { id: Date.now(), ...newSensorPayload }]);
    }

    setIsRegistering(false);
    setClickedCoords(null);
    setFormData({ type: 'TEMPERATURE', space: '', alertLimit: '' });
  };

  function MapEventsHandler() {
    useMapEvents({
      click(e) {
        const clickedX = Math.round(e.latlng.lng);
        const clickedY = Math.round(e.latlng.lat);
        
        const existingNode = sensors.find(s => 
          Math.abs(s.xCoordinates - clickedX) < 25 && 
          Math.abs(s.yCoordinates - clickedY) < 25 &&
          (s.floor || 'FLOOR_1') === currentFloor
        );

        if (!existingNode) {
          setClickedCoords({ x: clickedX, y: clickedY });
          setIsRegistering(true);
        }
      },
    });
    return null;
  }

  return (
    <section className="py-12 max-w-[1600px] mx-auto px-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-blue-900 font-sans">Wano University Spaces Map</h1>
          <p className="text-sm text-slate-500">
            Review real-time resource distribution and floor occupancy baselines.
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={() => console.log("Equipments Module")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition"
          >
            <Wrench size={16} />
            Equipments Module
          </button>
          
          <button 
            onClick={() => alert("Admin Panel")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <Settings size={16} />
            Admin Panel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden h-[650px] w-full">
          <MapContainer
            crs={L.CRS.Simple}
            bounds={bounds}
            maxZoom={2}
            minZoom={-1}
            style={{ width: '100%', height: '100%' }}
            className="rounded-2xl z-10 border border-slate-100"
          >
            <ImageOverlay 
              url={currentFloor === 'FLOOR_1' ? '/floor1.png' : '/floor2.png'} 
              bounds={bounds} 
            />

            <MapEventsHandler />

            {filteredSensors.map((sensor) => (
              <Marker 
                key={sensor.id} 
                position={[sensor.yCoordinates, sensor.xCoordinates]}
                icon={getSensorIcon(sensor.type, sensor.isActive)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px] font-sans text-slate-800">
                    <div className="flex justify-between items-center border-b pb-1.5 mb-2">
                      <strong className="block text-sm font-bold text-blue-900 truncate pr-2">
                        {/* Display the new space name in the map popup */}
                        {sensor.space || `Node #${sensor.id}`}
                      </strong>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${sensor.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                        {sensor.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <p><span className="font-semibold text-slate-400">Class Type:</span> {sensor.type}</p>
                      <p><span className="font-semibold text-slate-400">Alert Threshold:</span> {sensor.alertLimit}</p>
                      <p><span className="font-semibold text-slate-400">Coordinates:</span> X:{sensor.xCoordinates} | Y:{sensor.yCoordinates}</p>
                      
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                        <span className="text-[11px] text-slate-400">Toggle Operations State:</span>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(sensor.id, sensor.isActive)}
                          className={`p-1 rounded transition-colors ${sensor.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {isRegistering && clickedCoords && (
            <div className="absolute top-4 right-4 z-[1000] bg-white p-5 rounded-2xl shadow-2xl border border-slate-200 w-72 transition-all">
              <form onSubmit={handleRegisterSensor} className="font-sans space-y-3">
                
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-blue-900">Deploy New Node</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 block mt-0.5 w-max">
                      X: {clickedCoords.x} | Y: {clickedCoords.y}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setIsRegistering(false); setClickedCoords(null); }} 
                    className="text-slate-400 hover:text-red-500 text-xl font-bold p-1 transition-colors"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">System Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="TEMPERATURE">Temperature</option>
                    <option value="ENERGY_CONSUMPTION">Energy Consumption</option>
                    <option value="AIR_QUALITY">Air Quality</option>
                    <option value="OCCUPANCY">Occupancy</option>
                  </select>
                </div>

                {/* Updated Space Name Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Space Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Zen Garden Alpha"
                    value={formData.space}
                    onChange={(e) => setFormData({...formData, space: e.target.value})}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Trigger Limit</label>
                  <input 
                    type="number" 
                    placeholder="Limit threshold index"
                    value={formData.alertLimit}
                    onChange={(e) => setFormData({...formData, alertLimit: e.target.value})}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm"
                >
                  Save to Database
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers size={14} />
              Floor Navigation
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrentFloor('FLOOR_1')}
                className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all ${currentFloor === 'FLOOR_1' ? 'bg-blue-900 border-blue-900 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                Floor 01 (Base)
              </button>
              <button
                type="button"
                onClick={() => setCurrentFloor('FLOOR_2')}
                className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all ${currentFloor === 'FLOOR_2' ? 'bg-blue-900 border-blue-900 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              >
                Floor 02 (Upper)
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter size={14} />
              System Metrics Filter
            </h2>
            
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTypeFilter('ALL')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'ALL' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <span>All Active Sub-Systems</span>
                <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 text-[10px] font-bold">
                  {sensors.filter(s => (s.floor || 'FLOOR_1') === currentFloor).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('TEMPERATURE')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'TEMPERATURE' ? 'border-white text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                style={selectedTypeFilter === 'TEMPERATURE' ? { backgroundColor: 'var(--fire-color)' } : {}}
              >
                <Thermometer size={16} style={selectedTypeFilter === 'TEMPERATURE' ? {color: 'white'} : {color: 'var(--fire-color)'}} />
                <span>Temperature Trackers</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('ENERGY_CONSUMPTION')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'ENERGY_CONSUMPTION' ? 'border-white text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                style={selectedTypeFilter === 'ENERGY_CONSUMPTION' ? { backgroundColor: 'var(--nika-color)' } : {}}
              >
                <Zap size={16} style={selectedTypeFilter === 'ENERGY_CONSUMPTION' ? {color: 'white'} : {color: 'var(--nika-color)'}} />
                <span>Energy Matrix Grid</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('AIR_QUALITY')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'AIR_QUALITY' ? 'border-white text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                style={selectedTypeFilter === 'AIR_QUALITY' ? { backgroundColor: 'var(--tanuki-color)' } : {}}
              >
                <Wind size={16} style={selectedTypeFilter === 'AIR_QUALITY' ? {color: 'white'} : {color: 'var(--tanuki-color)'}} />
                <span>Atmospheric Diagnostics</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('OCCUPANCY')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'OCCUPANCY' ? 'border-white text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                style={selectedTypeFilter === 'OCCUPANCY' ? { backgroundColor: 'var(--swordsman-color)' } : {}}
              >
                <Users size={16} style={selectedTypeFilter === 'OCCUPANCY' ? {color: 'white'} : {color: 'var(--swordsman-color)'}} />
                <span>Density & Occupancy</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl flex gap-3 text-xs leading-relaxed">
            <AlertTriangle className="shrink-0 text-blue-700" size={18} />
            <p>
              <strong>Deployment Hint:</strong> Click directly anywhere empty on the custom blueprints layout canvas to capture target grid coordinate configurations and set up alternative operational metrics monitoring profiles.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}