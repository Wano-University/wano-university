import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Download, Thermometer } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTranslation } from "react-i18next";


const chartConfig = {
  temperature: {
    label: "Average Temperature: ",
    color: "#4ade80",
  },
}

export default function TemperatureDashboard() {
  const [data, setData] = useState({
    sensors: [],
    stats: [],
    chartData: []
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { t } = useTranslation();
  
  // NOVO ESTADO: Guarda qual sensor foi clicado/selecionado
  const [selectedSensorId, setSelectedSensorId] = useState(null)
  
  const [currentPage, setCurrentPage] = useState(1)
  const sensorsPerPage = 6

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/dashboard/temperature")
        if (!response.ok) throw new Error(`HTTP error ${response.status}`)
        
        const result = await response.json()
        
        setData({
          sensors: result?.sensors ?? [],
          stats: result?.stats ?? [],
          chartData: result?.chartData ?? []
        })
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Backend not responding or no data available")
        setData({ sensors: [], stats: [], chartData: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const { sensors, stats, chartData } = data

  const indexOfLastSensor = currentPage * sensorsPerPage
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor)
  const totalPages = Math.ceil(sensors.length / sensorsPerPage)
  const [lowestInput, setLowestInput] = useState("");
  const [highestInput, setHighestInput] = useState("");

const handleEditClick = () => {
  if (!selectedSensorId) return;

  const sensor = sensors.find(s => s.id === selectedSensorId);
  
  if (sensor) {
    setLowestInput(sensor.lowerLimit !== null ? sensor.lowerLimit.toString() : "");
    setHighestInput(sensor.upperLimit !== null ? sensor.upperLimit.toString() : "");
  }

  setIsEditModalOpen(true);
};

return (
    <div className="w-full h-full min-h-[calc(100vh-73px)] bg-background flex items-center justify-center p-4 lg:p-12">
      <div className="w-full xl:max-w-6xl h-full max-h-[850px] flex flex-col justify-center min-h-0">
        <Card className="bg-card w-full h-full rounded-3xl md:rounded-[2.5rem] p-5 lg:p-6 border border-border shadow-md flex flex-col min-h-0 justify-between overflow-hidden">
          
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-4 text-[#320088]">
            {t('TempDashTitle')}
          </h1>

          {error && <p className="text-center text-red-500 text-sm mb-2">{error}</p>}

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            
            {/* LEFT SIDE: SENSORS GRID */}
            <div className="flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 align-content-start">
                {currentSensors.length === 0 ? (
                  <p className="text-sm opacity-60 col-span-full text-center">{t('TempDashError')}</p>
                ) : (
                  currentSensors.map((sensor) => {
                    const isSelected = selectedSensorId === sensor.id
                    return (
                      <div 
                        key={sensor.id} 
                        onClick={() => setSelectedSensorId(isSelected ? null : sensor.id)}
                        className={`rounded-2xl p-4 flex justify-between h-[110px] items-center cursor-pointer transition-all duration-200 select-none
                          ${isSelected 
                            ? "bg-[#6338AF] ring-4 ring-white shadow-xl scale-[1.02]" 
                            : "bg-[#6338AF]/60 hover:bg-[#6338AF]/80"
                          }`}
                      >
                        <div>
                          <p className="font-bold text-xl opacity-80">Sensor {sensor.id}</p>
                          <p className="text-xl font-bold text-white">{sensor.temp}°C</p>
                        </div>
                        <div className="text-[#000000]">
                          <Thermometer className="w-14 h-14 stroke-[2.5]" />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* CONTROLS FOOTER */}
              <div className="left-1/2 flex items-center justify-center gap-6 w-auto whitespace-nowrap z-10">                  
                <div className="flex gap-2">
                    <button 
                      onClick={handleEditClick}
                      disabled={!selectedSensorId}
                      className="bg-foreground text-background px-4 py-2 rounded-full font-medium hover:opacity-90 transition disabled:opacity-40"
                    >
                      {t('TempDashEdit')}
                    </button>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1} 
                      className="bg-foreground text-background p-2 rounded-full disabled:opacity-40"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages || totalPages === 0} 
                      className="bg-foreground text-background p-2 rounded-full disabled:opacity-40"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={async () => {
                        try {
                          window.location.href = "http://localhost:3000/api/dashboard/temperature/export";
                        } catch (error) {
                          console.error("Export request failed:", error);
                          alert("Could not download report. Try again later.");
                        }
                      }}
                      className="bg-foreground text-background px-4 py-2 rounded-full font-medium hover:opacity-90 transition flex items-center gap-1"
                    >
                      Export <Download className="w-4 h-4" />
                    </button>  
                </div>
                {totalPages > 0 && <span className="mx-10 text-xs font-semibold opacity-70">{t('TempDashPage')} {currentPage} {t('TempDashOf')} {totalPages}</span>}
              </div>
            </div>

            {/* RIGHT SIDE: STATS & SHADCN CHART */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3 min-h-[140px]">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-[#6338AF]/60 rounded-2xl p-3 text-center">
                    <p className="text-2xl text-white font-bold">{stat.title}</p>
                    <div className="my-3 rounded-full text-[#000000] flex items-center justify-center mx-auto">
                      <Thermometer className="w-12 h-12 stroke-[2.5]" />
                    </div>
                    <p className="font-bold text-white text-xl">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* CHART */}
              <div className="bg-[#6338AF]/60 rounded-2xl p-4 lg:p-6 flex flex-col flex-1 min-h-[200px]">
                <div className="text-white font-bold text-center mb-4">{t('TempDashAvg')}</div>
                  <div className="w-full flex-1 min-h-0 flex items-center justify-center">
                    <div className="top-1/2 -translate-y-1/2 -rotate-90 text-white font-bold text-[15px] uppercase tracking-wider z-10 inline-block whitespace-nowrap">
                      {t('TempDashTempLabel')}
                    </div>
                  <ChartContainer className="w-full h-[250px] min-h-[250px]" config={chartConfig}>
                    <LineChart width={500} height={250} data={chartData} margin={{ top: 20, right: 120, left: -5, bottom: 20 }}>
                      <YAxis 
                        domain={['auto', 'auto']}
                        hide={true} 
                      />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" /> 
                        
                        <XAxis 
                          dataKey="hour" 
                          stroke="white" 
                          tick={{ fill: "white", fontSize: 10 }} 
                          tickLine={false} 
                          axisLine={false}
                          padding={{ left: 20, right: 40 }}
                        >
                          <Label value="Hour" position="insideBottom" offset={-10} fill="white" fontSize={12} fontWeight="bold" />
                        </XAxis>
                        
                        <ChartTooltip 
                          cursor={{ stroke: '#FFFFFF', strokeWidth: 1, strokeDasharray: '4 4' }} // Add a cursor line
                          content={<ChartTooltipContent indicator="line" labelKey="hour" nameKey="temperature" />} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#0BDA51" 
                          strokeWidth={4} 
                          // Add these props to force consistent rendering
                          dot={{ r: 4, fill: "#E0E0E0", strokeWidth: 0 }} 
                          activeDot={{ r: 6, fill: "#FFFFFF", stroke: "#0BDA51", strokeWidth: 2 }}
                        />
                      </LineChart>
                      <div className="w-full text-center -translate-x-1/10 text-white font-bold text-[15px] uppercase tracking-wider mt-[-10px]">
                      {t('TempDashHourLabel')}
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
              
              <h3 className="text-[#3B1E7B] font-bold text-xl mb-6">
                Sensor {selectedSensorId}
              </h3>

              <div className="space-y-4 mb-8 text-left">
                <div>
                  <label className="block text-[#3B1E7B]/70 text-sm font-semibold mb-1 ml-2">
                    {t('TempDashEditMin')}:
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
                    {t('TempDashEditMax')}:
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
                    
                    await fetch(`http://localhost:3000/api/dashboard/temperature/${selectedSensorId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    
                    setIsEditModalOpen(false);
                  }}
                  className="bg-[#6338AF] hover:bg-[#522c94] text-white font-bold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider"
                >
                  {t('TempDashEditY')}
                </button>
                <button onClick={() => setIsEditModalOpen(false)} className="bg-[#6338AF] hover:bg-[#522c94] text-white font-bold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider">
                  {t('TempDashEditN')}
                </button>
              </div>
            </div>
          </div>
        )}  
      </div>
    </div>
  )
}