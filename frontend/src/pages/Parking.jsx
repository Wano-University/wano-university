import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Settings, AlertTriangle, ShieldAlert, Bike } from 'lucide-react';
import { registerMobilityResource, getAllMobilityResources, updateMobilityStatus,  } from '../lib/mobilityResource.js';
import { Link } from "react-router-dom"

const simulateAndFetch = async () => {
  const response = await fetch('/api/parking'); // Substitui pelo teu URL real
  if (!response.ok) throw new Error('Erro ao buscar dados');
  return response.json();
};
const [resources, setResources] = useState([]);
const bounds = [[0, 0], [1100, 2000]];
const userString = localStorage.getItem('user');
const currentUser = userString ? JSON.parse(userString) : null;
const isAdmin = currentUser?.type === 'ADMIN';
const HARDCODED_SPACES = [
  { hcId: 'F1_R1', x: 410,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R2', x: 480,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R4', x: 550,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R5', x: 620,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R6', x: 690,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R7', x: 760, y: 835, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R8', x: 1270, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R9', x: 1340, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R10', x: 1410, y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R11', x: 1480,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R12', x: 1550,  y: 835, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R13', x: 1620, y: 835, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R14', x: 1753, y: 810, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R15', x: 1753, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R16', x: 1753, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R17', x: 1753,  y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R18', x: 1753,  y: 610, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R14_b', x: 1753, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R15_b', x: 1753, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R16_b', x: 1753, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R17_b', x: 1753,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R18_b', x: 1753,  y: 260, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R19',  x: 1753, y: 210, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R20', x: 1540, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R21',  x: 1540, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R22', x: 1540, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R23',  x: 1540,  y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R24',  x: 1540,  y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R25',  x: 1540, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R26', x: 1540, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R27',  x: 1540,  y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R28',  x: 1540,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R29',  x: 1540, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R20_b',  x: 1415, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R21_b',  x: 1415, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R22_b', x: 1415, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R23_b',  x: 1415,  y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R24_b',  x: 1415,  y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R25_b',  x: 1415, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R26_b', x: 1415, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R27_b',  x: 1415,  y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R28_b',  x: 1415,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R29_b',  x: 1415, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R30',  x: 1190, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R31',  x: 1190, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R32',  x: 1190, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R33',  x: 1190, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R34',  x: 1190,  y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R35',  x: 1190,  y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R36',  x: 1190, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R37',  x: 1190, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R38',  x: 1190,  y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R39',  x: 1190,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R40',  x: 1190, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R41',  x: 840, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R42',  x: 840, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R43',  x: 840, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R44',  x: 840, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R45',  x: 840,  y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R46',  x: 840,  y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R47',  x: 840, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R48',  x: 840, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R49',  x: 840,  y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R50',  x: 840,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R51',  x: 840, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R53', x: 615, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R54', x: 615, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R55', x: 615, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R56', x: 615,  y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R57', x: 615,  y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R58', x: 615, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R59',  x: 615, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R60',  x: 615,  y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R61',  x: 615,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R62',  x: 615, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R63', x: 490, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R64',  x: 490, y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R65',  x: 490, y: 610, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R66',  x: 490,  y: 560, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R67',  x: 490,  y: 510, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R68',  x: 490, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R69',  x: 490, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R70',  x: 490,  y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R71',  x: 490,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R72',  x: 490, y: 260, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R73',  x: 277, y: 810, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R74',  x: 277, y: 760, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R75', x:  277, y: 710, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R76',  x: 277,  y: 660, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R77',  x: 277,  y: 610, defaultType: 'PARKING_SPOT' },

  { hcId: 'F1_R78',  x: 277, y: 460, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R79',  x: 277, y: 410, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R80', x: 277, y: 360, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R81',  x: 277,  y: 310, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R82',  x: 277,  y: 260, defaultType: 'PARKING_SPOT' },
  { hcId: 'F1_R83',  x: 277, y: 210, defaultType: 'PARKING_SPOT' },
];

const getResourceIcon = (status, isRegistered) => {
  let colorVar, statusClass;

  if (!isRegistered) {
    colorVar = 'var(--muted-foreground)';
    statusClass = 'opacity-80 border-dashed animate-pulse';
  } else {
    switch (status) {
      case 'FREE':
        colorVar = 'var(--swordsman-color)';
        statusClass = '';
        break;
      case 'OCCUPIED':
        colorVar = 'var(--meat)';  // red — matches your existing color system
        statusClass = '';
        break;
      case 'INACTIVE':
      default:
        colorVar = 'var(--muted-foreground)';
        statusClass = 'opacity-80 border-dashed';
        break;
    }
  }

  return L.divIcon({
    className: 'custom-resource-icon',
    html: `
      <div class="flex items-center justify-center w-5 h-5 rounded-xl border-2 border-primary-foreground shadow-lg transition-all ${statusClass}"
           style="background-color: ${colorVar}; color: var(--primary-foreground);">
        <svg .../>
      </div>`,
    iconSize: [20, 20], iconAnchor: [18, 18], popupAnchor: [0, -16],
  });
};

export default function InteractiveMap() {
  const {
    data: resources = [],
    error: swrError,
    mutate,
  } = useSWR('parking-resources', simulateAndFetch, {
    refreshInterval: 25000,    
    revalidateOnFocus: false,   
  });

  const [displayLayout, setDisplayLayout] = useState([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [resourceForm, setResourceForm] = useState({ status: 'FREE', identifier: '' });
  const [errorMessage, setErrorMessage] = useState(swrError?.message || '');

  const fetchResources = async () => {
    try {
      setErrorMessage('');
      const data = await getAllMobilityResources();
      setResources(data || []);
    } catch (error) {
      console.error("Failed to load resources:", error);
      setErrorMessage(error.message);
      setResources([]);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    let combined = HARDCODED_SPACES.map(hcSpace => {
      const dbMatch = resources.find(r =>
        Math.abs(r.xCoordinates - hcSpace.x) < 20 &&
        Math.abs(r.yCoordinates - hcSpace.y) < 20
      );

      return {
        ...hcSpace,
        isRegistered: !!dbMatch,
        dbData: dbMatch ? dbMatch : null,
        displayType: dbMatch ? dbMatch.type : hcSpace.defaultType,
      };
    });

    setDisplayLayout(combined);
  }, [resources]);

  const handleMarkerClick = () => {
    setResourceForm({ status: 'FREE', identifier: '' });
    setErrorMessage('');
  };

const handleRegisterResource = async (e, space) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await registerMobilityResource({
        type: 'PARKING_SPOT',
        identifier: resourceForm.identifier,
        status: resourceForm.status,
        xCoordinates: space.x,
        yCoordinates: space.y,
      });
      mutate(); 
      alert('Space activated successfully!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save resource.');
    }
  };


  const handleStatusChange = async (id, newStatus) => {
    setErrorMessage('');
    try {
      await updateMobilityStatus(id, newStatus);
      mutate(); // same here
      alert('Parking status updated successfully!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update status.');
    }
  };

  return (
    <section className="py-12 max-w-400 mx-auto px-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 border-primary-foreground">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Wano University Parking Map</h1>
          <p className="text-sm text-muted-foreground/80">
            {isAdminMode ? "Admin privileges enabled: Parking management." : "Click on icons to check availability. Green = free. Gray = inactive or unregistered. Red = occupied."}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Link 
                to="/bikes"
                className="flex items-center gap-2 px-4 py-2 bg-primary-foreground hover:bg-muted text-muted-foreground text-sm font-medium rounded-xl transition"
                >
                <Bike size={16} />
                Public Bikes
                </Link>
          {isAdmin && (
            <button
    onClick={() => setIsAdminMode(!isAdminMode)}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition shadow-sm border ${
      isAdminMode
        ? "bg-meat/20 border-meat/50 text-meat hover:bg-meat/10"
        : "bg-foreground/80 border-foreground text-primary-foreground hover:bg-foreground"
    }`}
  >
    <Settings size={16} />
    {isAdminMode ? "Exit Admin Panel" : "Admin Panel Mode"}
  </button>
)}
        </div>
      </div>

    {/* Map container */}
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full max-w-5xl mx-auto bg-primary-foreground rounded-2xl border shadow-sm p-4">
          <div className="w-full relative overflow-hidden rounded-xl">
            <MapContainer
              crs={L.CRS.Simple}
              bounds={bounds}
              maxZoom={2}
              minZoom={-1}
              style={{ width: '100%', height: '100%', minHeight: '600px', backgroundColor: 'transparent' }}
              className="rounded-2xl z-10 border border-primary-foreground shadow-sm"
            >
              <ImageOverlay url="/parking.png" bounds={bounds} />

              {displayLayout.map((space) => (
                <Marker
                  key={space.hcId}
                  position={[space.y, space.x]}
                  icon={getResourceIcon(space.dbData?.status ?? 'FREE', space.isRegistered)}
                  eventHandlers={{ click: handleMarkerClick }}
                >
                  <Popup maxWidth={320}>
                    <div className="p-1 min-w-[280px] text-foreground/80 font-sans">

                      {errorMessage && (
                        <div className="mb-3 p-2 bg-meat/20 border-meat/50 text-meat text-xs rounded border flex items-start gap-1.5">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                      )}
                      {space.isRegistered && space.dbData ? (
                        <>
                          {space.dbData.status === 'INACTIVE' ? (
                            <div className="text-center py-2 space-y-1">
                              <strong className="block text-sm font-bold text-foreground">{space.dbData.identifier}</strong>
                              <p className="text-xs text-meat font-medium leading-relaxed bg-meat/10 py-1.5 rounded-lg border border-meat/20">
                                Parking space currently unavailable
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center border-b border-muted pb-2 mb-3">
                                <div>
                                  <strong className="block text-sm font-bold text-foreground">{space.dbData.identifier}</strong>
                                  <span className="text-[11px] text-muted-foreground/80 capitalize">{space.dbData.type?.toLowerCase()}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-swordsman/80 bg-swordsman/10">
                                  {space.dbData.status}
                                </span>
                              </div>
                            </>
                          )}

                        {/* Admin thingy */}
                          {isAdminMode && (
                            <div className="mt-3 pt-3 border-t border-muted space-y-2">
                              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldAlert size={14} className="text-swordsman" /> Admin Actions
                              </h4>
                              <div className="bg-background p-2.5 rounded-xl border border-muted space-y-2">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase">Update Space Status</label>
                                <select
                                  value={space.dbData.status}
                                  onChange={(e) => handleStatusChange(space.dbData.id, e.target.value)}
                                  className="w-full text-xs p-1.5 rounded-lg border border-muted bg-background text-foreground"
                                >
                                  <option value="FREE">Free (Active)</option>
                                  <option value="INACTIVE">Inactive</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        isAdminMode ? (
                          <form onSubmit={(e) => handleRegisterResource(e, space)} className="space-y-3">
                            <div className="border-b border-muted pb-2">
                              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <ShieldAlert size={16} className="text-swordsman" /> Activate Space
                              </h3>
                              <span className="text-[10px] text-muted-foreground block mt-0.5">Register this parking space to the system.</span>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Initial Status</label>
                              <select
                                value={resourceForm.status}
                                onChange={(e) => setResourceForm({ ...resourceForm, status: e.target.value })}
                                className="w-full text-xs p-2 mt-1 rounded-lg border border-muted bg-background text-foreground"
                              >
                                <option value="FREE">Free</option>
                                <option value="INACTIVE">Inactive</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Identifier</label>
                              <input
                                type="text"
                                required
                                value={resourceForm.identifier}
                                onChange={(e) => setResourceForm({ ...resourceForm, identifier: e.target.value })}
                                className="w-full text-xs p-2 mt-1 rounded-lg border border-muted bg-background text-foreground"
                              />
                            </div>

                            <button type="submit" className="w-full bg-muted-foreground/60 hover:bg-muted-foreground/80 text-primary-foreground text-xs font-bold py-2.5 rounded-xl transition shadow-sm">
                              Register & Activate
                            </button>
                          </form>
                        ) : (
                          <div className="text-center py-4 space-y-2">
                            <ShieldAlert size={24} className="mx-auto text-muted-foreground/50 mb-2" />
                            <strong className="block text-sm font-bold text-foreground">Space Unregistered</strong>
                            <p className="text-xs text-muted-foreground leading-relaxed">This space is not registered for parking.</p>
                          </div>
                        )
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}