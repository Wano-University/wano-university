import { useState } from "react"
import useSWR, { mutate } from "swr"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@/providers/ThemeProvider"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Download, Thermometer } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTranslation } from "react-i18next";


const fetchTrend = async () => {
  return await getTemperatureTrend();
};

export default function TemperatureDashboard() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const activeTab = "temperature"

  const { data: sensorData, isLoading: sensorsLoading } = useSWR(SIMULATE_KEY, fetchSensors, { refreshInterval: 60000 });
  const { data: trendData, isLoading: trendLoading } = useSWR(TREND_KEY, fetchTrend, { refreshInterval: 300000 });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { t } = useTranslation();
  
  // NOVO ESTADO: Guarda qual sensor foi clicado/selecionado
  const [selectedSensorId, setSelectedSensorId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lowerLimitInput, setLowerLimitInput] = useState("")
  const [upperLimitInput, setUpperLimitInput] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const sensorsPerPage = 6
  const sensors = sensorData?.sensors ?? []
  const stats = sensorData?.stats ?? []
  const alertsGenerated = sensorData?.alertsGenerated ?? 0

  const totalPages = Math.ceil(sensors.length / sensorsPerPage)
  const currentSensors = sensors.slice((currentPage - 1) * sensorsPerPage, currentPage * sensorsPerPage)

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
    labels: (trendData ?? []).map(d => d.hour),
    datasets: [{
      fill: false,
      label: 'Avg Temp',
      data: (trendData ?? []).map(d => d.temperature),
      borderColor: 'hsl(var(--primary))',
      backgroundColor: 'hsla(var(--primary), 0.1)',
      tension: 0.4,
      pointBackgroundColor: 'hsl(var(--card))',
      pointBorderColor: 'hsl(var(--primary))',
      pointBorderWidth: 2,
      pointRadius: 4,
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
        callbacks: { label: (ctx) => `${ctx.parsed.y}°C` }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'hsl(var(--muted-foreground))', font: { size: 11 } } },
      y: { grid: { color: 'hsl(var(--border))', borderDash: [3, 3] }, ticks: { color: 'hsl(var(--muted-foreground))', font: { size: 11 }, callback: (v) => `${v}°C` }, border: { display: false } }
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Thermometer className="w-8 h-8 text-primary" /> Temperature Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time thermal monitoring and climate control.</p>
        </div>
        {alertsGenerated > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-xl font-bold text-sm border border-destructive/20 cursor-default shadow-sm">
            <AlertTriangle className="w-4 h-4" /> {alertsGenerated} Alert{alertsGenerated !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="order-1 lg:col-start-1 lg:col-span-7 lg:row-start-1">
          <div className="flex gap-2 p-1 bg-card border border-border rounded-2xl shadow-sm">
            {SENSOR_TABS.map(({ key, label, icon: Icon, path }) => (
              <button key={key} onClick={() => navigate(path)} className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 ${activeTab === key ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="order-2 lg:col-start-8 lg:col-span-5 lg:row-start-1">
          <div className="grid grid-cols-3 gap-4 h-full">
            {stats.length > 0 ? stats.map((stat, i) => (
              <Card key={i} className="p-4 flex flex-col justify-between h-32 hover:shadow-md transition-all cursor-default">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</span>
                <p className="text-2xl font-black text-foreground truncate mt-2">{stat.value}</p>
              </Card>
            )) : Array(3).fill(0).map((_, i) => <Card key={i} className="h-32 animate-pulse" />)}
          </div>
        </div>

        <div className="order-3 lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:row-span-2">
          <Card className="p-6 flex flex-col h-full min-h-[350px] hover:shadow-md transition-all cursor-default">
            <h3 className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2"><Thermometer className="w-4 h-4" /> Trend</h3>
            {trendLoading ? <div className="flex-1 flex items-center justify-center">Loading...</div> : <div className="w-full h-full min-h-[280px]"><Line key={theme} options={chartOptions} data={chartJsData} /></div>}
          </Card>
        </div>

        <div className="order-4 lg:col-start-1 lg:col-span-7 lg:row-start-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-h-[300px]">
            {sensorsLoading ? Array(6).fill(0).map((_, i) => <Card key={i} className="h-36 animate-pulse" />) : currentSensors.map(s => {
              const isSelected = selectedSensorId === s.id;
              const isAnomaly = (s.upperLimit && s.temp > s.upperLimit) || (s.lowerLimit && s.temp < s.lowerLimit);
              return (
                <Card key={s.id} onClick={() => setSelectedSensorId(isSelected ? null : s.id)} className={`p-5 cursor-pointer transition-all duration-300 border-2 hover:-translate-y-1 ${isSelected ? "border-primary bg-primary/5 scale-[1.03]" : isAnomaly ? "border-destructive/50 bg-destructive/5" : "border-border"}`}>
                  <Thermometer className={`w-5 h-5 mb-4 ${isAnomaly ? "text-destructive" : "text-primary"}`} />
                  <p className="text-2xl font-black">{s.temp}°C</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">ID: {s.id}</p>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="order-5 lg:col-start-1 lg:col-span-7 lg:row-start-3">
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-card rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-muted text-foreground disabled:opacity-40"><ArrowLeft className="w-4 h-4" /></button>
              <span className="text-sm font-bold w-20 text-center">Page {currentPage}</span>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="p-2 rounded-lg bg-muted text-foreground disabled:opacity-40"><ArrowRight className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={handleEditClick} disabled={!selectedSensorId} className="px-4 py-2 rounded-lg bg-secondary text-sm font-bold disabled:opacity-40"><Settings className="w-4 h-4 inline mr-2" /> Edit</button>
              <button onClick={handleExport} disabled={isExporting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold"><Download className="w-4 h-4 inline mr-2" /> Export</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
