import { useState } from "react"
import useSWR, { mutate } from "swr"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../providers/ThemeProvider"
import { Card } from "../components/ui/card"
import { ArrowLeft, ArrowRight, Download, Thermometer, Settings, Info, AlertTriangle, Zap, Wind } from "lucide-react"
import { simulateTemperature, updateTemperatureLimits, getTemperatureReport } from "../lib/sensors"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Filler);

const SIMULATE_KEY = "temperature-simulate"

const SENSOR_TABS = [
  { key: "energy", label: "Energy", icon: Zap, path: "/energydashboard" },
  { key: "temperature", label: "Temperature", icon: Thermometer, path: "/temperaturedashboard" },
  { key: "air", label: "Air Quality", icon: Wind, path: "/airqualitydashboard" },
]

const fetcher = async () => {
  const result = await simulateTemperature()
  return {
    sensors: result?.sensors ?? [],
    stats: result?.stats ?? [],
    chartData: (result?.chartData ?? []).map(item => ({
      ...item,
      temperature: Number(item.temperature),
    })),
    alertsGenerated: result?.alertsGenerated ?? 0,
  }
}

export default function TemperatureDashboard() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const activeTab = "temperature"

  const SIMULATE_KEY = "temperature-simulate"
  const { data: sensorData, isLoading: sensorsLoading } = useSWR(SIMULATE_KEY, fetchSensors, { refreshInterval: 60000 });
  const { data: trendData, isLoading: trendLoading } = useSWR(TREND_KEY, fetchTrend, { refreshInterval: 300000 });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { t } = useTranslation();

  const [selectedSensorId, setSelectedSensorId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lowerLimitInput, setLowerLimitInput] = useState("")
  const [upperLimitInput, setUpperLimitInput] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const sensorsPerPage = 6
  const sensors = data?.sensors ?? []
  const stats = data?.stats ?? []
  const chartData = data?.chartData ?? []
  const alertsGenerated = data?.alertsGenerated ?? 0

  const indexOfLastSensor = currentPage * sensorsPerPage
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor)
  const totalPages = Math.ceil(sensors.length / sensorsPerPage)

  const handleEditClick = () => {
    if (!selectedSensorId) return
    const sensor = sensors.find(s => s.id === selectedSensorId)
    if (sensor) {
      setLowerLimitInput(sensor.lowerLimit !== null ? sensor.lowerLimit.toString() : "")
      setUpperLimitInput(sensor.upperLimit !== null ? sensor.upperLimit.toString() : "")
    }
    setIsEditModalOpen(true)
  }

  const handleUpdateLimits = async () => {
    try {
      await updateTemperatureLimits(selectedSensorId, {
        lowerLimit: lowerLimitInput ? parseFloat(lowerLimitInput) : null,
        upperLimit: upperLimitInput ? parseFloat(upperLimitInput) : null,
      })
      setIsEditModalOpen(false)
      mutate(SIMULATE_KEY)
    } catch {
      alert("Error updating limits")
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const blob = await getTemperatureReport()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `temperature_report_${new Date().toISOString().slice(0, 7)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert(err.message || "Failed to export report")
    } finally {
      setIsExporting(false)
    }
  }

  const chartJsData = {
    labels: chartData.map(d => d.hour),
    datasets: [{
      fill: true,
      label: 'Average Temperature',
      data: chartData.map(d => d.temperature),
      borderColor: 'hsl(var(--primary))',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      tension: 0.4,
      pointBackgroundColor: 'hsl(var(--card))',
      pointBorderColor: 'hsl(var(--primary))',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--foreground))',
        bodyColor: 'hsl(var(--muted-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: { label: (context) => `${context.parsed.y}°C` }
      }
    },
    scales: {
      x: { grid: { display: false, drawBorder: false }, ticks: { color: 'hsl(var(--muted-foreground))', font: { size: 11 } } },
      y: { grid: { color: 'hsl(var(--border))', borderDash: [3, 3] }, ticks: { color: 'hsl(var(--muted-foreground))', font: { size: 11 }, callback: (value) => `${value}°C` }, border: { display: false } }
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Thermometer className="w-8 h-8 text-primary" /> Temperature Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time thermal monitoring and climate control.</p>
        </div>
        {alertsGenerated > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-xl font-bold text-sm border border-destructive/20 cursor-default shadow-sm">
            <AlertTriangle className="w-4 h-4" /> {alertsGenerated} Active Alert{alertsGenerated !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

        {/* 1. Tabs */}
        <div className="order-1 lg:col-start-1 lg:col-span-7 lg:row-start-1">
          <div className="flex gap-2 p-1 bg-card border border-border rounded-2xl shadow-sm">
            {SENSOR_TABS.map(({ key, label, icon: Icon, path }) => (
              <button
                key={key}
                onClick={() => navigate(path)}
                className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 ${activeTab === key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Top Stats (3 columns for Min/Avg/Max) */}
        <div className="order-2 lg:col-start-8 lg:col-span-5 lg:row-start-1">
          <div className="grid grid-cols-3 gap-4 h-full">
            {stats.length > 0 ? (
              stats.map((stat, i) => (
                <Card key={i} className="p-4 flex flex-col justify-between h-32 overflow-hidden min-w-0 hover:shadow-md transition-all cursor-default">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight">
                    {stat.title}
                  </span>
                  <p className="text-2xl lg:text-3xl font-black text-foreground truncate mt-2">
                    {stat.value}
                  </p>
                </Card>
              ))
            ) : (
              Array(3).fill(0).map((_, i) => <Card key={i} className="h-32 animate-pulse" />)
            )}
          </div>
        </div>

        {/* 3. Graph */}
        <div className="order-3 lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:row-span-2">
          <Card className="p-6 flex flex-col h-full min-h-[350px] hover:shadow-md transition-all cursor-default">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> Recent Temperature Trend
            </h3>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Loading Chart...</div>
            ) : chartData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">No data yet.</div>
            ) : (
              <div className="w-full h-full min-h-[280px]">
                <Line key={theme} options={chartOptions} data={chartJsData} />
              </div>
            )}
          </Card>
        </div>

        {/* 4. Sensors */}
        <div className="order-4 lg:col-start-1 lg:col-span-7 lg:row-start-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-h-[300px]">
            {isLoading
              ? Array(6).fill(0).map((_, i) => <Card key={i} className="h-36 animate-pulse" />)
              : currentSensors.length > 0
                ? currentSensors.map(sensor => {
                  const isSelected = selectedSensorId === sensor.id
                  const isOverLimit = sensor.upperLimit !== null && sensor.temp > sensor.upperLimit
                  const isUnderLimit = sensor.lowerLimit !== null && sensor.temp < sensor.lowerLimit
                  const isAnomaly = isOverLimit || isUnderLimit

                  return (
                    <Card
                      key={sensor.id}
                      onClick={() => setSelectedSensorId(isSelected ? null : sensor.id)}
                      className={`p-5 cursor-pointer transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-lg ${isSelected ? "border-primary bg-primary/5 scale-[1.03] shadow-md"
                        : isAnomaly ? "border-destructive/50 bg-destructive/5"
                          : "border-border hover:border-primary/40"
                        }`}
                    >
                      <Thermometer className={`w-5 h-5 mb-4 ${isAnomaly ? "text-destructive" : "text-primary"}`} />
                      <p className="text-2xl font-black text-foreground">{sensor.temp}°C</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">ID: {sensor.id}</p>
                    </Card>
                  )
                })
                : Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="h-36 border-2 border-dashed border-border opacity-40 bg-transparent" />
                ))}
          </div>
        </div>

        {/* 5. Pagination & Management Bar */}
        <div className="order-5 lg:col-start-1 lg:col-span-7 lg:row-start-3">
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-card rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 hover:shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold w-20 text-center">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 hover:shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setIsInfoModalOpen(true)} className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all cursor-pointer">
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={handleEditClick}
                disabled={!selectedSensorId}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-bold hover:bg-secondary/80 hover:shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> {isExporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 border-border shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg">Sensor {selectedSensorId}</h3>
                <p className="text-sm text-muted-foreground">Adjust trigger boundaries (°C).</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5 ml-1">Lower Limit (°C)</label>
                <input
                  type="number"
                  value={lowerLimitInput}
                  onChange={e => setLowerLimitInput(e.target.value)}
                  placeholder="Min Limit"
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5 ml-1">Upper Limit (°C)</label>
                <input
                  type="number"
                  value={upperLimitInput}
                  onChange={e => setUpperLimitInput(e.target.value)}
                  placeholder="Max Limit"
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpdateLimits} className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all cursor-pointer">
                Save
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-muted text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 active:scale-95 transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Info Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6 border-border shadow-2xl animate-in zoom-in-95">
            <h3 className="font-black text-xl mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Thermal Efficiency Tips
            </h3>
            <ul className="space-y-3 mb-6 text-sm text-muted-foreground font-medium">
              <li className="flex items-start gap-2"><Thermometer className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Optimal server room temperature is between 18°C and 27°C.</li>
              <li className="flex items-start gap-2"><Thermometer className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Avoid placing temperature sensors directly under HVAC vents to prevent skewed readings.</li>
              <li className="flex items-start gap-2"><Thermometer className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Set up automated alerts for any spikes above 28°C to protect sensitive equipment.</li>
            </ul>
            <button onClick={() => setIsInfoModalOpen(false)} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all cursor-pointer">
              Close
            </button>
          </Card>
        </div>
      )}
    </section>
  )
}
