import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Settings, AlertTriangle, ShieldAlert, Bike, Wind } from 'lucide-react';
import { registerMobilityResource, getAllMobilityResources, updateMobilityStatus, simulateParkingOccupancy } from '../lib/mobilityResource.js';
import { Link } from "react-router-dom";

const bounds = [[0, 0], [1100, 2000]];
const HARDCODED_SPACES = [
  { hcId: 'F1_R1', x: 410, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R2', x: 480, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R4', x: 550, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R5', x: 620, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R6', x: 690, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R7', x: 760, y: 835, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R8', x: 1270, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R9', x: 1340, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R10', x: 1410, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R11', x: 1480, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R12', x: 1550, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R13', x: 1620, y: 835, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R14', x: 1753, y: 810, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R15', x: 1753, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R16', x: 1753, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R17', x: 1753, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R18', x: 1753, y: 610, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R14_b', x: 1753, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R15_b', x: 1753, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R16_b', x: 1753, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R17_b', x: 1753, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R18_b', x: 1753, y: 260, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R19', x: 1753, y: 210, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R20', x: 1540, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R21', x: 1540, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R22', x: 1540, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R23', x: 1540, y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R24', x: 1540, y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R25', x: 1540, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R26', x: 1540, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R27', x: 1540, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R28', x: 1540, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R29', x: 1540, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R20_b', x: 1415, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R21_b', x: 1415, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R22_b', x: 1415, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R23_b', x: 1415, y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R24_b', x: 1415, y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R25_b', x: 1415, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R26_b', x: 1415, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R27_b', x: 1415, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R28_b', x: 1415, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R29_b', x: 1415, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R30', x: 1190, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R31', x: 1190, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R32', x: 1190, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R33', x: 1190, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R34', x: 1190, y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R35', x: 1190, y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R36', x: 1190, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R37', x: 1190, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R38', x: 1190, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R39', x: 1190, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R40', x: 1190, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R41', x: 840, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R42', x: 840, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R43', x: 840, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R44', x: 840, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R45', x: 840, y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R46', x: 840, y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R47', x: 840, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R48', x: 840, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R49', x: 840, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R50', x: 840, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R51', x: 840, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R53', x: 615, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R54', x: 615, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R55', x: 615, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R56', x: 615, y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R57', x: 615, y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R58', x: 615, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R59', x: 615, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R60', x: 615, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R61', x: 615, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R62', x: 615, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R63', x: 490, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R64', x: 490, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R65', x: 490, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R66', x: 490, y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R67', x: 490, y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R68', x: 490, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R69', x: 490, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R70', x: 490, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R71', x: 490, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R72', x: 490, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R73', x: 277, y: 810, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R74', x: 277, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R75', x: 277, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R76', x: 277, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R77', x: 277, y: 610, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R78', x: 277, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R79', x: 277, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R80', x: 277, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R81', x: 277, y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R82', x: 277, y: 260, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R83', x: 277, y: 210, defaultType: 'PARKING_SPOT' },
];

const getResourceIcon = (status, isRegistered) => {
  let bgColor = !isRegistered ? '#6b7280' : (status === 'FREE' ? '#22c55e' : status === 'OCCUPIED' ? '#ef4444' : '#6b7280');
  let statusClass = (!isRegistered || status === 'INACTIVE') ? 'opacity-80 border-dashed animate-pulse' : '';

  return L.divIcon({
    className: 'custom-resource-icon',
    html: `<div class="flex items-center justify-center w-5 h-5 rounded-xl border-2 border-white/80 shadow-lg ${statusClass}" style="background-color: ${bgColor}; color:white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
            </svg>
          </div>`,
    iconSize: [20, 20], iconAnchor: [18, 18], popupAnchor: [0, -16],
  });
};

export default function InteractiveMap() {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [resources, setResources] = useState([]);
  const [displayLayout, setDisplayLayout] = useState([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [resourceForm, setResourceForm] = useState({ status: 'FREE', identifier: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.type === 'ADMIN';

  const { mutate } = useSWR('parking-resources', simulateParkingOccupancy, {
    refreshInterval: 25000,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck) setScale(Math.min(window.innerWidth / 1400, (window.innerHeight - 80) / 800, 1));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllMobilityResources().catch(() => []);
      setResources(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    setDisplayLayout(HARDCODED_SPACES.map(hc => {
      const dbMatch = resources.find(r => Math.abs(r.xCoordinates - hc.x) < 20 && Math.abs(r.yCoordinates - hc.y) < 20);
      return { ...hc, isRegistered: !!dbMatch, dbData: dbMatch };
    }));
  }, [resources]);

  const handleRegister = async (e, space) => {
    e.preventDefault();
    try {
      await registerMobilityResource({ type: 'PARKING_SPOT', identifier: resourceForm.identifier, status: resourceForm.status, xCoordinates: space.x, yCoordinates: space.y });
      mutate();
      alert('Space activated!');
    } catch (err) { setErrorMessage(err.message); }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between border-b pb-6">
        <h1 className="text-3xl font-bold">Parking Map</h1>
        <div className="flex gap-3">
          {isAdmin && (
            <button onClick={() => setIsAdminMode(!isAdminMode)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
              {isAdminMode ? "Exit Admin" : "Admin Mode"}
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-card rounded-2xl p-4 h-[600px] border shadow-sm">
        <MapContainer crs={L.CRS.Simple} bounds={bounds} style={{ width: '100%', height: '100%' }}>
          <ImageOverlay url="/parking.png" bounds={bounds} />
          {displayLayout.map((space) => (
            <Marker key={space.hcId} position={[space.y, space.x]} icon={getResourceIcon(space.dbData?.status ?? 'FREE', space.isRegistered)}>
              <Popup>
                {space.isRegistered ? (
                  <div>
                    <strong>{space.dbData.identifier}</strong>
                    <p>Status: {space.dbData.status}</p>
                    {isAdminMode && (
                      <select onChange={(e) => updateMobilityStatus(space.dbData.id, e.target.value).then(mutate)}>
                        <option value="FREE">Free</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    )}
                  </div>
                ) : isAdminMode ? (
                  <form onSubmit={(e) => handleRegister(e, space)}>
                    <input placeholder="ID" onChange={e => setResourceForm({ ...resourceForm, identifier: e.target.value })} />
                    <button type="submit">Activate</button>
                  </form>
                ) : <p>Unregistered</p>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
