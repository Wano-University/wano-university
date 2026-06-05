import React, { useState, useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Wrench, Settings, Filter, AlertTriangle, Home, FlaskConical, Calendar as CalendarIcon, Users, ShieldAlert, Clock } from 'lucide-react';

// Import your services
import { getResourcesByFloor, registerResource, getResourceReservations } from '../lib/resource.js'; 
import { createReservation } from '../lib/reservation.js'; 

const bounds = [[0, 0], [1100, 2000]];

const HARDCODED_SPACES = [
  { hcId: 'F1_R1', floor: 'FLOOR_1', x: 477, y: 828, defaultType: 'ROOM'},
  { hcId: 'F1_R2', floor: 'FLOOR_1', x: 151, y: 576, defaultType: 'ROOM' },
  { hcId: 'F1_R3', floor: 'FLOOR_1', x: 800, y: 400, defaultType: 'ROOM' },
  { hcId: 'F1_R4', floor: 'FLOOR_1', x: 284, y: 400, defaultType: 'ROOM' },
  { hcId: 'F1_R5', floor: 'FLOOR_1', x: 725, y: 128, defaultType: 'ROOM' },
  { hcId: 'F1_R6', floor: 'FLOOR_1', x: 338, y: 148, defaultType: 'ROOM' },
  { hcId: 'F1_R7', floor: 'FLOOR_1', x: 1490, y: 266, defaultType: 'ROOM' },
  { hcId: 'F1_R8', floor: 'FLOOR_1', x: 1798, y: 146, defaultType: 'ROOM' },
  { hcId: 'F1_R9', floor: 'FLOOR_1', x: 1486, y: 792, defaultType: 'ROOM' },
  { hcId: 'F1_R10', floor: 'FLOOR_1', x: 1832, y: 536, defaultType: 'ROOM' },

  { hcId: 'F2_R1', floor: 'FLOOR_2', x: 1544, y: 782, defaultType: 'ROOM' },
  { hcId: 'F2_R2', floor: 'FLOOR_2', x: 1836, y: 532, defaultType: 'ROOM' },
  { hcId: 'F2_R3', floor: 'FLOOR_2', x: 1650, y: 346, defaultType: 'ROOM' },
  { hcId: 'F2_R4', floor: 'FLOOR_2', x: 1774, y: 174, defaultType: 'ROOM' },
  { hcId: 'F2_R5', floor: 'FLOOR_2', x: 1364, y: 172, defaultType:'ROOM' },
  { hcId: 'F2_R6', floor: 'FLOOR_2', x: 729, y: 170, defaultType: 'ROOM' },
  { hcId: 'F2_R7', floor: 'FLOOR_2', x: 329, y: 176, defaultType: 'ROOM' },
  { hcId: 'F2_R8', floor: 'FLOOR_2', x: 291, y: 420, defaultType: 'ROOM' },
  { hcId: 'F2_R9', floor: 'FLOOR_2', x: 185, y: 582, defaultType: 'ROOM' },
  { hcId: 'F2_R10', floor: 'FLOOR_2', x: 562, y: 640, defaultType: 'ROOM' },
  { hcId: 'F2_R11', floor: 'FLOOR_2', x: 693, y: 736, defaultType: 'ROOM' },
  { hcId: 'F2_R12', floor: 'FLOOR_2', x: 375, y: 784, defaultType: 'ROOM' },
  { hcId: 'F2_R13', floor: 'FLOOR_2', x: 591, y: 898, defaultType: 'ROOM' },
];

const getResourceIcon = (type, isAvailable, isRegistered) => {
  let colorVar = isRegistered ? 'var(--foreground)' : 'var(--muted-foreground)'; 
  
  const statusClass = isRegistered 
    ? (isAvailable ? '' : 'opacity-40 grayscale border-dashed')
    : 'opacity-80 border-dashed animate-pulse';

  switch (type) {
    case 'ROOM':
      colorVar = isRegistered ? '#3b82f6' : colorVar;
      return L.divIcon({
        className: 'custom-resource-icon',
        html: `<div class="flex items-center justify-center w-9 h-9 rounded-xl border-2 border-primary-foreground shadow-lg transition-all ${statusClass}" style="background-color: ${colorVar}; color: var(--primary-foreground);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
        iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -16]
      });
    case 'LABORATORY':
      colorVar = isRegistered ? '#10b981' : colorVar;
      return L.divIcon({
        className: 'custom-resource-icon',
        html: `<div class="flex items-center justify-center w-9 h-9 rounded-xl border-2 border-primary-foreground shadow-lg transition-all ${statusClass}" style="background-color: ${colorVar}; color: var(--primary-foreground);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2z"/><path d="M6 2h12"/><path d="M8 14h7"/></svg></div>`,
        iconSize: [36, 36], iconAnchor: [18, 18], popupAnchor: [0, -16]
      });
    default:
      return null;
  }
};

const ReservationForm = ({ space, bookingForm, setBookingForm, onSubmit }) => (
  <form onSubmit={(e) => onSubmit(e, space.id)} className="space-y-3 pt-3 border-t border-muted mt-2">
    <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
      <CalendarIcon size={14} /> Schedule reservation
    </h4>
    <div className="space-y-2">
      <div>
        <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Target Date</label>
        <input 
          type="date" 
          required 
          value={bookingForm.date} 
          onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} 
          className="w-full text-xs p-2 rounded-lg border border-muted bg-background focus:bg-background focus:outline-none focus:ring-2 focus:chef transition-all text-foreground" 
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Start time</label>
          <div className="relative">
            <Clock size={12} className="absolute left-2 top-2.5 text-muted-foreground/80" />
            <input 
              type="time" 
              required 
              value={bookingForm.startTime} 
              onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})} 
              className="w-full text-xs p-2 pl-6 rounded-lg border border-muted bg-background focus:bg-background focus:outline-none focus:ring-2 focus:bg-muted-foreground/20 transition-all text-foreground" 
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">End time</label>
          <div className="relative">
            <Clock size={12} className="absolute left-2 top-2.5 text-muted-foreground/80" />
            <input 
              type="time" 
              required 
              value={bookingForm.endTime} 
              onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})} 
              className="w-full text-xs p-2 pl-6 rounded-lg border border-muted bg-background focus:bg-background focus:outline-none focus:ring-2 focus:bg-muted-foreground/20 transition-all text-foreground" 
            />
          </div>
        </div>
      </div>
    </div>
    <button 
      type="submit" 
      disabled={!space.isAvailable} 
      className="w-full mt-3 bg-muted-foreground/60 hover:bg-muted-foreground/80 text-primary-foreground text-xs font-bold py-2.5 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {space.isAvailable ? 'Confirm reservation' : 'Space Unavailable'}
    </button>
  </form>
);

export default function InteractiveMap() {
  const [resources, setResources] = useState([]);
  const [displayLayout, setDisplayLayout] = useState([]);
  const [currentFloor, setCurrentFloor] = useState('FLOOR_1');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [resourceForm, setResourceForm] = useState({ type: 'ROOM', name: '', capacity: '30' });
  const [bookingForm, setBookingForm] = useState({ date: '', startTime: '', endTime: '', userId: '1' });
  const [activeResourceReservations, setActiveResourceReservations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchResources = async () => {
    try {
      setErrorMessage('');
      const data = await getResourcesByFloor(currentFloor);
      const mapRelevantResources = (data || []).filter(r => r.type !== 'EQUIPMENT');
      setResources(mapRelevantResources);
    } catch (error) {
      console.error("Failed to load resources:", error);
      setErrorMessage(error.message);
      setResources([]); 
    }
  };

  useEffect(() => {
    fetchResources();
  }, [currentFloor]);

  useEffect(() => {
    const activeFloorHardcoded = HARDCODED_SPACES.filter(s => s.floor === currentFloor);
    
    let combined = activeFloorHardcoded.map(hcSpace => {
      const dbMatch = resources.find(r => 
        Math.abs(r.xCoordinates - hcSpace.x) < 20 && 
        Math.abs(r.yCoordinates - hcSpace.y) < 20
      );

      return {
        ...hcSpace,
        isRegistered: !!dbMatch,
        dbData: dbMatch || null,
        displayType: dbMatch ? dbMatch.type : hcSpace.defaultType 
      };
    });

    if (selectedTypeFilter !== 'ALL') {
      combined = combined.filter(space => space.displayType === selectedTypeFilter);
    }

    setDisplayLayout(combined);
  }, [resources, currentFloor, selectedTypeFilter]);

  const handleMarkerClick = async (space) => {
    setResourceForm({ type: space.defaultType, name: '', capacity: '30' });
    setBookingForm({ date: '', startTime: '', endTime: '', userId: '1' });
    setErrorMessage('');
    
    if (space.isRegistered && space.dbData) {
      try {
        const resList = await getResourceReservations(space.dbData.id);
        setActiveResourceReservations(resList || []);
      } catch (err) {
        console.error("Could not fetch active bookings:", err);
      }
    }
  };

  const handleRegisterResource = async (e, space) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const savedResource = await registerResource({
        type: resourceForm.type,
        name: resourceForm.name,
        capacity: parseInt(resourceForm.capacity) || 1,
        isAvailable: true,
        floor: currentFloor, 
        xCoordinates: space.x,
        yCoordinates: space.y
      });
      
      setResources([...resources, savedResource]); 
      alert("Space activated successfully!");
    } catch (err) {
      setErrorMessage(err.message || "Failed to save resource.");
    }
  };

  const handleCreateReservation = async (e, resourceId) => {
    e.preventDefault();
    setErrorMessage('');
    
    const targetStart = new Date(`${bookingForm.date}T${bookingForm.startTime}:00`);
    const targetEnd = new Date(`${bookingForm.date}T${bookingForm.endTime}:00`);

    if (targetStart >= targetEnd) {
      setErrorMessage("Error: End time must occur after the start time.");
      return;
    }

    const hasOverlap = activeResourceReservations.some(booking => {
      if (booking.status === 'CANCELED') return false;
      const existingStart = new Date(booking.startTime);
      const existingEnd = new Date(booking.endTime);
      return targetStart < existingEnd && targetEnd > existingStart;
    });

    if (hasOverlap) {
      setErrorMessage("Can't finish reservation. This room is already reserved for the set time.");
      return;
    }

    try {
      await createReservation({
        userId: parseInt(bookingForm.userId),
        resourceId: resourceId,
        startTime: targetStart.toISOString(),
        endTime: targetEnd.toISOString(),
        status: 'ACTIVE'
      });
      alert("Reservation created successfully!");
      handleMarkerClick({ isRegistered: true, dbData: { id: resourceId } });
    } catch (err) {
      setErrorMessage(err.message || "Failed to create reservation.");
    }
  };

  return (
    <section className="py-12 max-w-400 mx-auto px-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 border-primary-foreground">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Wano University Spaces Map</h1>
          <p className="text-sm text-muted-foreground/80">
            {isAdminMode 
              ? "Admin privileges enabled: Space management." 
              : "Click on icons for information and occupancy details. Make your reservations!"}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
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
              <ImageOverlay url={currentFloor === 'FLOOR_1' ? '/floor1.png' : '/floor2.png'} bounds={bounds} />

              {displayLayout.map((space) => (
                <Marker 
                  key={space.hcId} 
                  position={[space.y, space.x]}
                  icon={getResourceIcon(space.displayType, space.dbData?.isAvailable ?? false, space.isRegistered)}
                  eventHandlers={{ click: () => handleMarkerClick(space) }}
                >
                  <Popup maxWidth={320}>
                    <div className="p-1 min-w-[280px] text-foreground/80 font-sans">
                      
                      {errorMessage && (
                        <div className="mb-3 p-2 bg-meat/20 border-meat/50 text-meat hover:bg-meat/10 text-xs rounded border flex items-start gap-1.5">
                          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {space.isRegistered && space.dbData ? (
                        <>
                          <div className="flex justify-between items-center border-b border-muted pb-2 mb-3">
                            <div>
                              <strong className="block text-sm font-bold text-foreground">{space.dbData.name}</strong>
                              <span className="text-[11px] text-muted-foreground/80 capitalize">{space.dbData.type.toLowerCase()}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${space.dbData.isAvailable ? 'text-swordsman/80 hover:bg-swordsman/20' : 'text-muted-foreground hover:bg-primary-foreground/20'}`}>
                              {space.dbData.isAvailable ? 'OPERATIONAL' : 'MAINTENANCE'}
                            </span>
                          </div>

                          <div className="text-xs space-y-1 mb-2 bg-background p-2 rounded-lg border border-muted">
                            <p className="flex justify-between">
                              <span className="text-muted-foreground">Max Room Capacity:</span> 
                              <span className="font-semibold flex items-center gap-1 text-foreground"><Users size={12}/>{space.dbData.capacity} seats</span>
                            </p>
                          </div>

                          {/* RENDER FORMS CONDITIONALLY BASED ON ADMIN MODE */}
                          {!isAdminMode ? (
                            <ReservationForm 
                              space={space.dbData} 
                              bookingForm={bookingForm} 
                              setBookingForm={setBookingForm} 
                              onSubmit={handleCreateReservation} 
                            />
                          ) : (
                            <div className="mt-3 pt-3 border-t border-muted space-y-2">
                              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldAlert size={14} className="text-amber-500" /> Admin Visualization
                              </h4>
                              <div className="bg-background p-2.5 rounded-xl border border-muted">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  You are viewing a registered space. Reservation functions are disabled in Admin Panel mode.
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        isAdminMode ? (
                          <form onSubmit={(e) => handleRegisterResource(e, space)} className="space-y-3">
                            <div className="border-b border-muted pb-2">
                              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <ShieldAlert size={16} className="text-amber-500"/> Activate Space
                              </h3>
                              <span className="text-[10px] text-muted-foreground block mt-0.5">Register this physical space to the system.</span>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Space Class</label>
                              <select value={resourceForm.type} onChange={(e) => setResourceForm({...resourceForm, type: e.target.value})} className="w-full text-xs p-2 mt-1 rounded-lg border border-muted bg-background text-foreground">
                                <option value="ROOM">Room / Lecture Hall</option>
                                <option value="LABORATORY">Laboratory Space</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Resource Name</label>
                              <input type="text" placeholder="e.g. Amphitheater B" value={resourceForm.name} onChange={(e) => setResourceForm({...resourceForm, name: e.target.value})} className="w-full text-xs p-2 mt-1 rounded-lg border border-muted bg-background text-foreground" required />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-muted-foreground uppercase">Seating Capacity</label>
                              <input type="number" value={resourceForm.capacity} onChange={(e) => setResourceForm({...resourceForm, capacity: e.target.value})} className="w-full text-xs p-2 mt-1 rounded-lg border border-muted bg-background text-foreground" required />
                            </div>

                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm">
                              Register & Activate Space
                            </button>
                          </form>
                        ) : (
                          <div className="text-center py-4 space-y-2">
                            <ShieldAlert size={24} className="mx-auto text-muted-foreground/50 mb-2"/>
                            <strong className="block text-sm font-bold text-foreground">Space Unavailable</strong>
                            <p className="text-xs text-muted-foreground leading-relaxed">This facility location has not yet been registered. Reservations disabled.</p>
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

        <div className="lg:col-span-4 space-y-6">
          {/* Level Switcher */}
          <div className="bg-primary-foreground p-5 rounded-3xl border border-muted-foreground/20 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers size={14} /> Level Matrix Selection
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setCurrentFloor('FLOOR_1')} className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all ${currentFloor === 'FLOOR_1' ? 'bg-foreground/80 border-foreground text-primary-foreground shadow-md' : 'bg-background border-muted text-muted-foreground hover:bg-muted'}`}>Floor 01</button>
              <button onClick={() => setCurrentFloor('FLOOR_2')} className={`py-2.5 px-4 text-sm font-semibold rounded-xl border transition-all ${currentFloor === 'FLOOR_2' ? 'bg-foreground/80 border-foreground text-primary-foreground shadow-md' : 'bg-background border-muted text-muted-foreground hover:bg-muted'}`}>Floor 02</button>
            </div>
          </div>

          {/* Filtering Workspace */}
          <div className="bg-primary-foreground p-5 rounded-3xl border border-muted-foreground/20 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Filter size={14} /> Filter Layout
            </h2>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setSelectedTypeFilter('ALL')} className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'ALL' ? 'bg-foreground/80 border-foreground text-primary-foreground' : 'bg-background border-muted text-muted-foreground hover:bg-muted'}`}>
                <span>Display All Spaces</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedTypeFilter === 'ALL' ? 'bg-primary-foreground/20 border-primary-foreground/30' : 'bg-muted border-muted-foreground/20'}`}>{displayLayout.length}</span>
              </button>
              <button onClick={() => setSelectedTypeFilter('ROOM')} className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'ROOM' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-background border-muted text-muted-foreground hover:bg-muted'}`}>
                <Home size={16} /> <span>Rooms & Halls</span>
              </button>
              <button onClick={() => setSelectedTypeFilter('LABORATORY')} className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold border transition-all ${selectedTypeFilter === 'LABORATORY' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-background border-muted text-muted-foreground hover:bg-muted'}`}>
                <FlaskConical size={16} /> <span>Laboratories</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}