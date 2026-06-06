import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Download, Zap, Battery, Info } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  power: {
    label: "Average Power",
    color: "#4ade80",
  },
}

export default function EnergyConsumptionDashboard() {
  const [data, setData] = useState({
    sensors: [],
    totalPower: "0 W",
    peak: {},
    chartData: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSensorId, setSelectedSensorId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lowestInput, setLowestInput] = useState("")
  const [highestInput, setHighestInput] = useState("")
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const sensorsPerPage = 6

  const handleInfoClick = () => {
    setIsInfoModalOpen(true);
  };
  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/dashboard/energy")
      if (!response.ok) throw new Error(`HTTP error ${response.status}`)
      
      const result = await response.json()
      
      const sanitizedChartData = (result?.chartData ?? []).map(item => ({
        ...item,
        power: Number(item.power)
      }))

      setData({
        sensors: result?.sensors ?? [],
        totalPower: result?.totalPower ?? "0 W",
        peak: result?.peak ?? {},
        chartData: result?.chartData ?? []
      })
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Backend not responding or no data available")
      setData({ sensors: [], totalPower: "0 W", peak: {}, chartData: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const { sensors, totalPower, peak, chartData } = data

  const stats = [
    { title: "Total Power", value: totalPower },
    { title: "Peak Sensor", value: peak?.sensorId ? `Sensor ${peak.sensorId}` : "N/A" },
    { title: "Peak Value", value: peak?.value ? `${peak.value} W` : "0 W" }
  ]

  const indexOfLastSensor = currentPage * sensorsPerPage
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor)
  const totalPages = Math.ceil(sensors.length / sensorsPerPage)

  const handleEditClick = () => {
    console.log("Edit button clicked. Current Sensor ID:", selectedSensorId);
    console.log("Available sensors array:", sensors);
    
    if (selectedSensorId) {
      const sensor = sensors.find(s => s.id === selectedSensorId);
      if (sensor) {
        setLowestInput(sensor.lowerLimit !== null ? sensor.lowerLimit.toString() : "");
        setHighestInput(sensor.upperLimit !== null ? sensor.upperLimit.toString() : "");
      }
      console.log("Setting modal to open");
      setIsEditModalOpen(true);
    } else {
      console.log("SelectedSensorId is null, cannot open modal.");
    }
  };

  const currentLivePower = sensors.reduce((acc, sensor) => {
    const val = typeof sensor.val === 'string' ? parseFloat(sensor.val.replace(/[^\d.-]/g, '')) : (sensor.val || 0);
    return acc + val;
  }, 0);

  return (
    <div className="w-full min-h-[calc(100vh-73px)] bg-background p-4 lg:px-12 lg:py-4 flex justify-center items-start">
      <div className="w-full xl:max-w-6xl flex flex-col">
        <Card className="bg-card w-full rounded-3xl p-4 lg:p-6 border border-border shadow-md flex flex-col gap-4">          
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 text-[#320088]">
            Energy Consumption Dashboard
          </h1>

          {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            <div className="flex flex-col justify-between">

              <div className="bg-[#6338AF]/60 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-2xl text-[#320088]">Current Power</p>
                </div>
                
                <div className="flex-1 text-center">
                  <p className="font-bold text-4xl text-white">{currentLivePower.toFixed(0)} W</p>
                </div>
                
                <div className="text-white">
                  <div className="text-black">
                    <Battery className="w-20 h-12" />
                    </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 align-content-start">
                {currentSensors.length === 0 ? (
                  <p className="text-sm opacity-60 col-span-full text-center">Loading or no data available...</p>
                ) : (
                  currentSensors.map((sensor) => {
                    const isSelected = selectedSensorId === sensor.id
                    return (
                      <div key={sensor.id} onClick={() => setSelectedSensorId(isSelected ? null : sensor.id)} className={`rounded-2xl p-4 flex justify-between h-[110px] items-center cursor-pointer transition-all duration-200 ${isSelected ? "bg-[#6338AF] ring-4 ring-white shadow-xl scale-[1.02]" : "bg-[#6338AF]/60 hover:bg-[#6338AF]/80"}`}>
                        <div>
                          <p className="font-bold text-xl opacity-80">Sensor {sensor.id}</p>
                          <p className="text-xl font-bold text-white">{sensor.val}</p>
                        </div>
                        <div className="text-[#000000]"><Zap className="w-14 h-14 stroke-[2.5]" /></div>
                      </div>
                    )
                  })
                )}
              </div>
             <div className="grid grid-cols-3 items-center mt-10 w-full">
                <div>
                  <button type="button" onClick={handleInfoClick} className="bg-foreground text-background px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={handleEditClick} disabled={!selectedSensorId} className="bg-foreground text-background px-4 py-2 rounded-full font-medium disabled:opacity-40">Edit</button>                
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="bg-foreground text-background p-2 rounded-full disabled:opacity-40"><ArrowLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="bg-foreground text-background p-2 rounded-full disabled:opacity-40"><ArrowRight className="w-4 h-4" /></button>
                  <button onClick={() => window.location.href = "http://localhost:3000/api/dashboard/energy/export"} className="bg-foreground text-background px-4 py-2 rounded-full font-medium flex items-center gap-1">Export <Download className="w-4 h-4" /></button>
                </div>

                <div className="flex justify-end pr-4">
                  {totalPages > 0 && <span className="text-xs font-semibold opacity-70">Page {currentPage} of {totalPages}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">              
              <div className="flex flex-col gap-4 min-h-[140px]">
                <div className="bg-[#6338AF]/60 rounded-2xl p-4 flex items-center cols-3 justify-between">
                  
                  <div className="max-w-[100px]"> 
                    <p className="text-[#320088] font-bold text-3xl leading-none">Today's Peak</p>
                  </div>
                  
                  <div>
                    <p className="text-[#320088] text-center font-bold text-3xl">Sensor {peak?.sensorId ?? 'N/A'}
                      <p className="text-white text-center font-bold text-xl lg:text-2xl">{peak?.value ?? 0} W</p>
                    </p>
                  </div>
                  
                  <div className="text-black"><Zap className="w-10 h-10" /></div>
                </div>
                
                <div className="bg-[#6338AF]/60 rounded-2xl p-4 text-center">
                  <p className="text-[#320088] font-bold text-3xl">Today's Total Consumption</p>
                  <p className="text-white font-bold text-4xl">{totalPower}</p>
                </div>
              
              </div>
              <div className="bg-[#6338AF]/60 rounded-2xl p-4 lg:p-6 flex flex-col flex-1 min-h-[200px]">
                <div className="text-white font-bold text-center mb-4">Average Power Usage Per Day</div>
                <div className="w-full flex-1 min-h-0 flex items-center justify-center">
                  <div className="top-1/2 -translate-y-1/2 -rotate-90 text-white font-bold text-[15px] uppercase tracking-wider z-10 inline-block whitespace-nowrap">
                    Power (W)
                  </div>
                  <ChartContainer className="w-full h-[250px] min-h-[250px]" config={chartConfig}>
                    <LineChart width={500} height={250} data={chartData} margin={{ top: 20, right: 120, left: -5, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" /> 
                  
                      <XAxis dataKey="time" stroke="white" tick={{ fill: "white", fontSize: 10 }} tickLine={false} axisLine={false} padding={{ left: 20, right: 40 }}>
                        <Label value="Date" position="insideBottom" offset={-10} fill="white" fontSize={12} fontWeight="bold" />
                      </XAxis>  
                      
                      <ChartTooltip cursor={false}content={<ChartTooltipContent indicator="line" />}/>
                      
                      <Line type="monotone" dataKey="power" stroke="#0BDA51" strokeWidth={4} dot={{ r: 4, fill: "#E0E0E0", strokeWidth: 0 }} activeDot={{ r: 6 }}/>
                    </LineChart>
                    <div className="w-full text-center -translate-x-1/10 text-white font-bold text-[15px] uppercase tracking-wider mt-[-10px]">
                      Date
                    </div>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md transition-all">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/30 w-[90%] max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
            <h3 className="text-[#3B1E7B] font-bold text-xl mb-6">Sensor {selectedSensorId} Limits</h3>
            
            <div className="space-y-4 mb-8 text-left">
              <div>
                <label className="block text-[#3B1E7B]/70 text-sm font-semibold mb-1 ml-2">Lowest:</label>
                <input 
                  type="number" value={lowestInput} onChange={(e) => setLowestInput(e.target.value)}
                  placeholder="N/A" className="w-full bg-white text-[#3B1E7B] font-medium px-4 py-3 rounded-full shadow-inner border border-transparent focus:outline-none transition text-lg"
                />
              </div>
              
              <div>
                <label className="block text-[#3B1E7B]/70 text-sm font-semibold mb-1 ml-2">Highest:</label>
                <input 
                  type="number" value={highestInput} onChange={(e) => setHighestInput(e.target.value)}
                  placeholder="N/A" className="w-full bg-white text-[#3B1E7B] font-medium px-4 py-3 rounded-full shadow-inner border border-transparent focus:outline-none transition text-lg"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={async () => {
                  await fetch(`http://localhost:3000/api/dashboard/energy/${selectedSensorId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lowerLimit: lowestInput, upperLimit: highestInput })
                  });
                  setIsEditModalOpen(false);
                  fetchData(); // Refresh data
                }}
                className="bg-[#6338AF] text-white font-bold px-6 py-2.5 rounded-md hover:opacity-90 transition"
              >
                Update
              </button>
              
              <button onClick={() => setIsEditModalOpen(false)} className="bg-[#6338AF] text-white font-bold px-6 py-2.5 rounded-md hover:opacity-90 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md transition-all">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/30 w-[90%] max-w-md rounded-3xl p-6 shadow-2xl relative text-center">
            <h3 className="text-[#3B1E7B] font-bold text-2xl mb-6">Energy Tips</h3>
            <div className="text-left space-y-4 mb-8 text-[#3B1E7B] font-medium">
              <p>Tip 1: Turn off the lights when they're not needed!</p>
              <p>Tip 2: Use natural light!</p>
              <p>Tip 3: Open or close windows to help with the temperature!</p>
            </div>
            <button 
              onClick={() => setIsInfoModalOpen(false)} 
              className="bg-[#6338AF] text-white font-bold px-8 py-2.5 rounded-full hover:opacity-90 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}