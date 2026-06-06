import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Wind, Cloud, Leaf, AlertTriangle } from "lucide-react";

export default function AirQualityDashboard() {
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [data, setData] = useState({ sensors: [], stats: [] })
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(0)
  const sensorsPerPage = 4
  const totalPages = Math.ceil(data.sensors.length / sensorsPerPage) || 1;
  const currentPage = page + 1;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lowestInput, setLowestInput] = useState("");
  const [highestInput, setHighestInput] = useState("");

  const handleEditClick = () => {
    if (!selectedId) return;
    const sensor = data.sensors.find(s => s.id === selectedId);
    
    if (sensor) {
      setLowestInput(sensor.lowerLimit != null ? String(sensor.lowerLimit) : "");
      setHighestInput(sensor.upperLimit != null ? String(sensor.upperLimit) : "");
    }
    
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768
      setIsMobile(mobileCheck)
      if (!mobileCheck) {
        const scaleX = window.innerWidth / 1400
        const scaleY = (window.innerHeight - 80) / 800
        setScale(Math.min(scaleX, scaleY, 1))
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/dashboard/air-quality");
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const json = await response.json();
        
        const processedSensors = (json.sensors || []).sort((a, b) => a.id - b.id).map(s => ({
          id: s.id,
          status: s.iqa > 80 ? "Poor" : s.iqa > 50 ? "Moderate" : "Excellent",
          iqa: s.iqa,
          pm: Math.round(s.iqa / 10) + " µg/m³",
          color: s.iqa > 80 ? "text-red-500" : s.iqa > 50 ? "text-yellow-500" : "text-green-500",
          lowerLimit: s.lowerLimit,
          upperLimit: s.upperLimit
        }));

        setData({
          sensors: processedSensors,
          stats: json.stats || []
        });
        setError(null);
      } catch (err) {
        console.error("Data fetch error:", err);
        setError("Failed to load air quality data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => setPage(p => Math.max(0, p - 1))
  const handleNext = () => {
    const maxPage = Math.ceil(data.sensors.length / sensorsPerPage) - 1
    setPage(p => Math.min(maxPage, p + 1))
  }

  return (
    <div className={isMobile ? "p-4 w-full h-full relative" : "w-full h-[calc(100vh-80px)] pt-25 relative flex items-center justify-center bg-background overflow-hidden"}>
    <div style={!isMobile ? { transform: `scale(${scale})`, transformOrigin: "top" } : {}} className="w-[1400px]">
      <Card className="relative overflow-hidden p-6 border shadow-lg rounded-[2.5rem]">
          <h1 className="text-4xl font-bold text-center mb-4 text-[#320088]">
            Air Quality Dashboard
          </h1>
          
        {/* Summary Row */}
        <div className="grid grid-cols-4 gap-12 mb-4">
          {data.stats.map((item, i) => (
            <div key={i} className="bg-[#6338AF]/60 p-4 rounded-3xl flex flex-row items-center justify-between px-6">
              
              {/* Text Container centered by flex-grow */}
              <div className="flex flex-col items-center flex-grow">
                <div className="text-[#320088] font-bold text-xl">{item.title}</div>
                <span className="text-4xl font-bold text-white leading-none mt-2">
                  {item.value}
                </span>
              </div>
              
              {/* The Wind Icon on the far right */}
              {item.title === "Average IQA" && (
                <div className="ml-4">
                  <Wind className="w-14 h-14 text-black" />
                </div>
              )}
              {item.title === "Average PM2.5" && (
                <div className="ml-4">
                  <Cloud className="w-14 h-14 text-black" />
                </div>
              )}
              {item.title === "Good IQA" && (
                <div className="ml-4">
                  <Leaf className="w-14 h-14 text-black" />
                </div>
              )}
              {item.title === "Worst IQA" && (
                <div className="ml-4">
                  <AlertTriangle className="w-14 h-14 text-black" />
                </div>
              )}
            </div>
          ))}
        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-10 md:gap-y-6 mb-8">
            {data.sensors
              .sort((a, b) => a.id - b.id)
              .slice(page * sensorsPerPage, (page + 1) * sensorsPerPage)
              .map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedId(s.id)} 
                  className={`cursor-pointer transition-all duration-300 p-6 md:p-8 rounded-3xl flex justify-between items-center 
                    ${selectedId === s.id ? 'bg-[#4A2D7A] ring-4 ring-white' : 'bg-[#6338AF]/60'}`}
                >
                  <div>
                    <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-xl md:text-3xl mb-1">Sensor {s.id}</div>
                    <div className={`font-bold text-lg md:text-3xl ${s.color}`}>{s.status}</div>
                    <div className="text-lg md:text-3xl font-semibold text-white/90">PM2.5 : {s.pm}</div>
                  </div>
                  <div className="text-2xl md:text-5xl font-bold text-white">IQA {s.iqa}</div>
                  <Wind className="w-10 h-10 md:w-16 md:h-16 text-black dark:text-[#E0D0FF] ml-4" />
                </div>
            ))}
          </div>

          <div className="grid grid-cols-3 items-center w-full px-4">
            <div className="flex justify-start">
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button onClick={handleEditClick} disabled={!selectedId} className={`px-10 py-3 rounded-full font-bold transition-colors ${selectedId ? "bg-foreground text-background" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}> 
                  Edit ✏️ 
              </button>
              <button onClick={handlePrev} disabled={page === 0} className="bg-foreground text-background p-3 rounded-full disabled:opacity-50">
                  <ArrowLeft />
              </button>
              <button onClick={handleNext} disabled={currentPage === totalPages} className="bg-foreground text-background p-3 rounded-full disabled:opacity-50">
                  <ArrowRight />
              </button>
              <button onClick={() => window.location.href = "http://localhost:3000/api/dashboard/air-quality/export"} className="bg-foreground text-background px-10 py-3 rounded-full font-bold"> 
                  Export 
              </button>
            </div>
            <div className="flex justify-end">
              <span className="font-bold text-lg text-[#320088]">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          </div>

          {isEditModalOpen && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-md">
              <div className="bg-white/40 backdrop-blur-2xl border border-white/30 w-[90%] max-w-md rounded-3xl p-6 shadow-2xl text-center">  
                <h3 className="text-[#3B1E7B] font-bold text-xl mb-6">
                  Sensor {selectedId} Limits
                </h3>

                <div className="space-y-4 mb-8 text-left">
                  <div>
                    <label className="block text-[#3B1E7B]/70 text-sm font-semibold mb-1 ml-2">
                      Lowest:
                    </label>
                   <input 
                      type="number"
                      value={lowestInput}
                      onChange={(e) => setLowestInput(e.target.value)}
                      placeholder="N/A"
                      className="w-full bg-white text-[#3B1E7B] font-medium px-4 py-3 rounded-full shadow-inner border border-transparent focus:outline-none focus:border-[#6338AF]/50 transition text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[#3B1E7B]/70 text-sm font-semibold mb-1 ml-2">
                      Highest:
                    </label>
                    <input 
                      type="number"
                      value={highestInput}
                      onChange={(e) => setHighestInput(e.target.value)}
                      placeholder="N/A"
                      className="w-full bg-white text-[#3B1E7B] font-medium px-4 py-3 rounded-full shadow-inner border border-transparent focus:outline-none focus:border-[#6338AF]/50 transition text-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 justify-center">        
                  <button 
                    onClick={async () => {
                      const payload = {
                        lowest: lowestInput === "N/A" ? "" : lowestInput,
                        highest: highestInput === "N/A" ? "" : highestInput
                      };
                        
                      await fetch(`http://localhost:3000/api/dashboard/air-quality/${selectedId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      
                      setIsEditModalOpen(false);
                    }}
                    className="bg-[#6338AF] hover:bg-[#522c94] text-white font-bold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider"
                  >
                    Update
                  </button>
                  <button onClick={() => setIsEditModalOpen(false)} className="bg-[#6338AF] hover:bg-[#522c94] text-white font-bold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}  
        </Card>
      </div>
    </div>
  )
}