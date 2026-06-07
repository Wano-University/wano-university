import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from "react-i18next";

import { Thermometer, Zap, Wind, Users, Layers, Wrench, Settings, Filter, Power, AlertTriangle } from 'lucide-react';
import { getSensorsByFloor, registerSensor, updateSensorStatus } from '../lib/sensors.js';

const bounds = [[0, 0], [1100, 2000]];
const user = JSON.parse(localStorage.getItem('user') || '{}');
const isAdmin = user?.type === 'ADMIN';

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
      colorVar = 'var(--surgeon-color)';
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      break;
  }

  return L.divIcon({
    className: 'custom-sensor-icon',
    html: `
      <div class="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-foreground shadow-md transition-all ${activeClass}" style="background-color: ${colorVar}; color: background;">
        ${iconHtml}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -14]
  });
};

function MapTracker({ clickedCoords, setPixelCoords }) {
  const map = useMap();

  useEffect(() => {
    if (!clickedCoords) return;

    const updatePosition = () => {
      const point = map.latLngToContainerPoint([clickedCoords.y, clickedCoords.x]);
      setPixelCoords({ x: point.x, y: point.y });
    };

    updatePosition();
    map.on('zoom', updatePosition);
    map.on('move', updatePosition);

    return () => {
      map.off('zoom', updatePosition);
      map.off('move', updatePosition);
    };
  }, [map, clickedCoords, setPixelCoords]);

  return null;
}

export default function InteractiveMap() {
  const [sensors, setSensors] = useState([]);
  const [filteredSensors, setFilteredSensors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState('FLOOR_1');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');

  const [clickedCoords, setClickedCoords] = useState(null);
  const [pixelCoords, setPixelCoords] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const { t } = useTranslation();


  const [formData, setFormData] = useState({
    type: 'TEMPERATURE',
    space: '',
    upperLimit: '',
    lowerLimit: ''
  });

  const fetchSensors = async () => {
    try {
      const data = await getSensorsByFloor(currentFloor);
      setSensors(data || []);
    } catch (error) {
      console.error("Failed to load sensors from database:", error);
      setSensors([]);
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
      await updateSensorStatus(id, !currentStatus);
      setSensors(sensors.map(s => s.id === id ? { ...s, isActive: !currentStatus } : s));
    } catch (err) {
      console.error("Backend update failed:", err);
      alert("Failed to sync with the database.");
    }
  };

  const closeForm = () => {
    setIsRegistering(false);
    setClickedCoords(null);
    setPixelCoords(null);
  };

  const handleRegisterSensor = async (e) => {
    e.preventDefault();

    let unit = "";
    switch (formData.type) {
      case 'TEMPERATURE':
        unit = 'ºC';
        break;
      case 'ENERGY_CONSUMPTION':
        unit = 'W';
        break;
      case 'AIR_QUALITY':
        unit = 'AQI';
        break;
    }

    const newSensorPayload = {
      type: formData.type,
      floor: currentFloor,
      space: formData.space,
      upperLimit: parseFloat(formData.upperLimit) || 0,
      lowerLimit: parseFloat(formData.lowerLimit) || 0,
      isActive: true,
      xCoordinates: clickedCoords.x,
      yCoordinates: clickedCoords.y,
      UnityMeasure: unit,
    };

    try {
      const savedSensor = await registerSensor(newSensorPayload);
      setSensors([...sensors, savedSensor]);

      closeForm();
      setFormData({ type: 'TEMPERATURE', space: '', upperLimit: '', lowerLimit: '' });
    } catch (err) {
      console.error("DEBUG - Prisma Error:", err);
      console.error("Sensor registration failed:", err);
      alert("Failed to save sensor to the database.");
    }
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

        if (!existingNode && user?.type == 'ADMIN') {
          setClickedCoords({ x: clickedX, y: clickedY });
          setIsRegistering(true);
        } else {
          closeForm();
        }
      },
    });
    return null;
  }

  return (
    <section className="py-12 max-w-400 mx-auto px-6 space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 border-primary-foreground">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">{t('IMapTitle')}</h1>
          <p className="text-sm text-muted-foreground/80">
            {t('IMapDesc')}
          </p>
        </div>

      </div>

      {/* Map container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-8 bg-primary-foreground p-4 rounded-3xl border border-muted-foreground/20 shadow-xl relative overflow-hidden min-h-150 lg:50">
          <div className="relative w-full h-full">
            <MapContainer
              crs={L.CRS.Simple}
              bounds={bounds}
              maxZoom={2}
              minZoom={-1}
              style={{ width: '100%', height: '100%', minHeight: '600px', backgroundColor: 'transparent' }}
              className="rounded-2xl z-10 border border-primary-foreground shadow-sm"
            >
              <ImageOverlay
                url={currentFloor === 'FLOOR_1' ? '/floor1.png' : '/floor2.png'}
                bounds={bounds}
              />

              <MapEventsHandler />
              <MapTracker clickedCoords={clickedCoords} setPixelCoords={setPixelCoords} />

              {/* Existing sensors */}
              {filteredSensors.map((sensor) => (
                <Marker
                  key={sensor.id}
                  position={[sensor.yCoordinates, sensor.xCoordinates]}
                  icon={getSensorIcon(sensor.type, sensor.isActive)}
                >
                  <Popup>
                    <div className="p-2 min-w-50 font-sans text-foreground/80">
                      <div className="flex justify-between items-center border-b pb-1.5 mb-2">
                        <strong className="block text-sm font-bold text-foreground/80 truncate pr-2">
                          {sensor.space || `Node #${sensor.id}`}
                        </strong>
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${sensor.isActive ? 'bg-primary-foreground text-swordsman/80' : 'bg-primary-foreground text-muted-foreground'}`}>
                          {sensor.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5">
                        <p><span className="font-semibold text-muted-foreground">{t('IMapClassType')}:</span> {sensor.type}</p>
                        <p><span className="font-semibold text-muted-foreground">{t('IMapUAlert')}:</span> {sensor.upperLimit}</p>
                        <p><span className="font-semibold text-muted-foreground">{t('IMapLAlert')}:</span> {sensor.lowerLimit}</p>
                        <p><span className="font-semibold text-muted-foreground">{t('IMapCoords')}:</span> X:{sensor.xCoordinates} | Y:{sensor.yCoordinates}</p>

                        <div className="pt-2 flex items-center justify-between border-t border-muted-foreground/20 mt-2">
                          <span className="text-[11px] text-muted-foreground">{t('IMapOpState')}:</span>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(sensor.id, sensor.isActive)}
                            className={`p-1 rounded transition-colors ${sensor.isActive ? 'text-swordsman/80 hover:bg-swordsman/20' : 'text-muted-foreground hover:bg-primary-foreground/20 cursor-pointer'}`}
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

            {/* Register sensor*/}
            {isRegistering && clickedCoords && pixelCoords && (
              <div
                className="absolute bg-primary-foreground shadow-xl rounded-xl border border-muted-foreground/20 z-1000 transition-all duration-100"
                style={{
                  left: pixelCoords.x,
                  top: pixelCoords.y,
                  transform: 'translate(-50%, -100%)',
                  marginTop: '-15px',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2 w-64">
                  <form onSubmit={handleRegisterSensor} className="font-sans space-y-3">
                    <div className="flex justify-between items-start border-b pb-2">
                      <div>
                        <h3 className="text-sm font-bold text-foreground/80">{t('IMapNewSensor')}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-background rounded text-muted-foreground block mt-0.5 w-max">
                          X: {clickedCoords.x} | Y: {clickedCoords.y}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={closeForm}
                        className="text-muted-foreground hover:text-foreground p-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Type Selection */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase">{t('IMapType')}</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-muted-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                      >
                        <option value="TEMPERATURE">{t('IMapTemp')}</option>
                        <option value="ENERGY_CONSUMPTION">{t('IMapEnergy')}</option>
                        <option value="AIR_QUALITY">{t('IMapAir')}</option>
                      </select>
                    </div>

                    {/* Location Input */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase">{t('IMapLocal')}</label>
                      <input
                        type="text"
                        value={formData.space}
                        onChange={(e) => setFormData({ ...formData, space: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-muted-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                        required
                      />
                    </div>

                    {/* New Upper and Lower Limit Fields */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase">{t('IMapUAlert')}</label>
                        <input
                          type="number"
                          value={formData.upperLimit}
                          onChange={(e) => setFormData({ ...formData, upperLimit: e.target.value })}
                          className="w-full text-xs p-2 rounded-lg border border-muted-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase">{t('IMapLAlert')}</label>
                        <input
                          type="number"
                          value={formData.lowerLimit}
                          onChange={(e) => setFormData({ ...formData, lowerLimit: e.target.value })}
                          className="w-full text-xs p-2 rounded-lg border border-muted-foreground/20 bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-foreground/80 hover:bg-foreground text-primary-foreground text-xs font-bold py-2.5 rounded-xl transition shadow-sm cursor-pointer"
                    >
                      {t('IMapSaveDB')}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floor change */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary-foreground p-5 rounded-3xl border border-primary-foreground shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers size={14} />
              {t('IMapFloorNav')}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurrentFloor('FLOOR_1')}
                className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all ${currentFloor === 'FLOOR_1' ? 'bg-foreground/80 border-muted-foreground/40 text-primary-foreground shadow-md' : 'bg-primary-foreground border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'}`}
              >
                {t('IMapFloor1')}
              </button>
              <button
                type="button"
                onClick={() => setCurrentFloor('FLOOR_2')}
                className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all ${currentFloor === 'FLOOR_2' ? 'bg-foreground/80 border-muted-foreground/40 text-primary-foreground shadow-md' : 'bg-primary-foreground border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'}`}
              >
                {t('IMapFloor2')}
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-primary-foreground p-5 rounded-3xl border border-primary-foreground shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter size={14} />
              {t('IMapFilter')}
            </h2>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTypeFilter('ALL')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'ALL' ? 'bg-foreground border-foreground text-primary-foreground' : 'bg-muted-foreground/10 border-primary-foreground text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'}`}
              >
                <span>{t('IMapActiveS')}</span>
                <span className="px-2 py-0.5 rounded bg-primary-foreground/80 text-muted-foreground text-[10px] font-bold">
                  {sensors.filter(s => (s.floor || 'FLOOR_1') === currentFloor).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('TEMPERATURE')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'TEMPERATURE' ? 'border-primary-foreground text-primary-foreground shadow-sm' : 'bg-primary-foreground border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'}`}
                style={selectedTypeFilter === 'TEMPERATURE' ? { backgroundColor: 'var(--fire-color)' } : {}}
              >
                <Thermometer size={16} style={selectedTypeFilter === 'TEMPERATURE' ? { color: 'primary-foreground' } : { color: 'var(--fire-color)' }} />
                <span>{t('IMapFTemp')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('ENERGY_CONSUMPTION')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'ENERGY_CONSUMPTION' ? 'border-primary-foreground text-primary-foreground shadow-sm' : 'bg-primary-foreground border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'}`}
                style={selectedTypeFilter === 'ENERGY_CONSUMPTION' ? { backgroundColor: 'var(--nika-color)' } : {}}
              >
                <Zap size={16} style={selectedTypeFilter === 'ENERGY_CONSUMPTION' ? { color: 'primary-foreground' } : { color: 'var(--nika-color)' }} />
                <span>{t('IMapFEC')}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTypeFilter('AIR_QUALITY')}
                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'AIR_QUALITY' ? 'border-primary-foreground text-primary-foreground shadow-sm' : 'bg-primary-foreground border-muted-foreground/20 text-muted-foreground hover:bg-muted-foreground/20 cursor-pointer'}`}
                style={selectedTypeFilter === 'AIR_QUALITY' ? { backgroundColor: 'var(--surgeon-color)' } : {}}
              >
                <Wind size={16} style={selectedTypeFilter === 'AIR_QUALITY' ? { color: 'primary-foreground' } : { color: 'var(--surgeon-color)' }} />
                <span>{t('IMapFAQ')}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-muted-foreground/10 border border-muted-foreground/60 text-muted-foreground/60 rounded-2xl flex gap-3 text-xs leading-relaxed">
            <AlertTriangle className="shrink-0 text-muted-foreground" size={18} />
            <p>
              <strong>{t('IMapDH')}:</strong> {t('IMapDHDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
