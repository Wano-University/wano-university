import React from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const bounds = [[0, 0], [1024, 1024]];

export default function InteractiveMap() {
  
  const sensors = [
    { id: 1, type: 'Temperature', name: 'Student Training Room', x: 200, y: 620, value: '22°C' },
    { id: 2, type: 'Air Quality', name: 'Contemplation Garden', x: 500, y: 780, value: 'Excellent' },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-blue-900">Wano University Spaces Map</h1>
        <p className="text-sm text-slate-500">
          Review real-time resource distribution and floor occupancy baselines.
        </p>
      </div>

      <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden h-[600px] w-full">
        
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          maxZoom={2}
          minZoom={-1}
          style={{ width: '100%', height: '100%' }}
          className="rounded-2xl z-10 border border-slate-100"
        >

          <ImageOverlay url="/floor1.png" bounds={bounds} />

          {sensors.map((sensor) => (
            <Marker key={sensor.id} position={[sensor.y, sensor.x]}>
              <Popup>
                <div className="p-1 min-w-[150px] font-sans">
                  <strong className="block text-sm font-bold text-blue-900 border-b pb-1 mb-1">
                    {sensor.name}
                  </strong>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><span className="font-semibold text-slate-400">Type:</span> {sensor.type}</p>
                    <p className="mt-2 bg-slate-100 p-1.5 rounded font-mono text-center text-emerald-600 font-bold border border-slate-200">
                      {sensor.value}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>
    </section>
  );
}