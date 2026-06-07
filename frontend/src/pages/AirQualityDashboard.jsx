import { useState } from "react"
import useSWR, { mutate } from "swr"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Download, Wind, Cloud, Leaf, Settings, Info, AlertTriangle, Thermometer, Zap } from "lucide-react"
import { simulateAirQuality, updateAirQualityLimits, getAirQualityReport } from "../lib/sensors"
import { useTranslation } from "react-i18next";


const SIMULATE_KEY = "air-quality-simulate"

const SENSOR_TABS = [
  { key: "energy", label: "DashboardTitleEnergy", icon: Zap, path: "/energydashboard" },
  { key: "temperature", label: "DashboardTitleTemp", icon: Thermometer, path: "/temperaturedashboard" },
  { key: "air", label: "DashboardTitleAir", icon: Wind, path: "/airqualitydashboard" },
]

const fetcher = async () => {
  const result = await simulateAirQuality()
  return {
    sensors: result?.sensors ?? [],
    stats: result?.stats ?? [],
    alertsGenerated: result?.alertsGenerated ?? 0,
  }
}

export default function AirQualityDashboard() {
  const navigate = useNavigate()
  const activeTab = "air"

  const { data, isLoading } = useSWR(SIMULATE_KEY, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  })

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedSensorId, setSelectedSensorId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lowerLimitInput, setLowerLimitInput] = useState("")
  const [upperLimitInput, setUpperLimitInput] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

  const sensorsPerPage = 6
  const sensors = data?.sensors ?? []
  const stats = data?.stats ?? []
  const alertsGenerated = data?.alertsGenerated ?? 0

  const indexOfLastSensor = currentPage * sensorsPerPage
  const indexOfFirstSensor = indexOfLastSensor - sensorsPerPage
  const currentSensors = sensors.slice(indexOfFirstSensor, indexOfLastSensor)
  const totalPages = Math.ceil(sensors.length / sensorsPerPage)
  const { t } = useTranslation();

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
      await updateAirQualityLimits(selectedSensorId, {
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
      const blob = await getAirQualityReport()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `air_quality_report_${new Date().toISOString().slice(0, 7)}.csv`
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

  // Helper to assign specific icons and colors to the 4 stats returned by the backend
  const getStatIcon = (title) => {
    if (title.includes("PM2.5")) return <Cloud className="w-6 h-6 text-primary" />;
    if (title.includes("Average IQA")) return <Wind className="w-6 h-6 text-primary" />;
    if (title.includes("Good")) return <Leaf className="w-6 h-6 text-green-500" />;
    if (title.includes("Worst")) return <AlertTriangle className="w-6 h-6 text-destructive" />;
    return <Wind className="w-6 h-6 text-primary" />;
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Wind className="w-8 h-8 text-primary" /> {t('AirDashboardTitle')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('AirDashboardDesc')}</p>
        </div>
        {alertsGenerated > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-xl font-bold text-sm border border-destructive/20 cursor-default shadow-sm">
            <AlertTriangle className="w-4 h-4" /> {alertsGenerated} {t('AirDashboardAler')} {alertsGenerated !== 1 ? "s" : ""}
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
                <Icon className="w-4 h-4" /> {t(label)}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Right Column Stats (Fills the space where the chart usually is) */}
        <div className="order-2 lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:row-span-3">
          <div className="grid grid-cols-2 gap-4 h-full min-h-[400px]">
            {stats.length > 0 ? (
              stats.map((stat, i) => (
                <Card key={i} className="p-6 flex flex-col justify-center items-center text-center hover:shadow-md transition-all duration-300 cursor-default border-border">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    {getStatIcon(stat.title)}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {stat.title}
                  </span>
                  <p className="text-3xl font-black text-foreground truncate w-full">
                    {stat.value}
                  </p>
                </Card>
              ))
            ) : (
              Array(4).fill(0).map((_, i) => <Card key={i} className="h-full animate-pulse" />)
            )}
          </div>
        </div>

        {/* 3. Sensors */}
        <div className="order-3 lg:col-start-1 lg:col-span-7 lg:row-start-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 min-h-[300px]">
            {isLoading
              ? Array(6).fill(0).map((_, i) => <Card key={i} className="h-36 animate-pulse" />)
              : currentSensors.length > 0
                ? currentSensors.map(sensor => {
                  const isSelected = selectedSensorId === sensor.id
                  const isOverLimit = sensor.upperLimit !== null && sensor.iqa > sensor.upperLimit
                  const isUnderLimit = sensor.lowerLimit !== null && sensor.iqa < sensor.lowerLimit
                  const isAnomaly = isOverLimit || isUnderLimit

                  const status = sensor.iqa > 80 ? "Poor" : sensor.iqa > 50 ? "Moderate" : "Excellent"
                  const statusColor = sensor.iqa > 80 ? "text-destructive" : sensor.iqa > 50 ? "text-yellow-500" : "text-green-500"

                  return (
                    <Card
                      key={sensor.id}
                      onClick={() => setSelectedSensorId(isSelected ? null : sensor.id)}
                      className={`p-5 cursor-pointer transition-all duration-300 border-2 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${isSelected ? "border-primary bg-primary/5 scale-[1.03] shadow-md"
                        : isAnomaly ? "border-destructive/50 bg-destructive/5"
                          : "border-border hover:border-primary/40"
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <Wind className={`w-5 h-5 ${isAnomaly ? "text-destructive" : "text-primary"}`} />
                        <span className={`text-[10px] font-black uppercase tracking-wider ${statusColor}`}>{status}</span>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-black text-foreground">{sensor.iqa} {t('AirDashboardIQA')}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">ID: {sensor.id}</p>
                      </div>
                    </Card>
                  )
                })
                : Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="h-36 border-2 border-dashed border-border opacity-40 bg-transparent" />
                ))}
          </div>
        </div>

        {/* 4. Pagination & Management Bar */}
        <div className="order-4 lg:col-start-1 lg:col-span-7 lg:row-start-3">
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-card rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 hover:shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold w-20 text-center">{t('AirDashboardPage')} {currentPage}</span>
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
                <Settings className="w-4 h-4" /> {t('AirDashboardEdit')}
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
                <p className="text-sm text-muted-foreground">{t('AirDashboardAdjust')}</p>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5 ml-1">{t('AirDashboardLower')}</label>
                <input
                  type="number"
                  value={lowerLimitInput}
                  onChange={e => setLowerLimitInput(e.target.value)}
                  placeholder="Min Limit"
                  className="w-full bg-background border border-border px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5 ml-1">{t('AirDashboardUpper')}</label>
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
                {t('AirDashboardSave')}
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="flex-1 bg-muted text-foreground font-bold py-3 rounded-xl hover:bg-muted/80 active:scale-95 transition-all cursor-pointer">
                {t('AirDashboardCancel')}
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
              <Info className="w-5 h-5 text-primary" /> {t('AirDashboardTips')}
            </h3>
            <ul className="space-y-3 mb-6 text-sm text-muted-foreground font-medium">
              <li className="flex items-start gap-2"><Leaf className="w-4 h-4 mt-0.5 text-primary shrink-0" /> {t('AirDashboardTip1')}</li>
              <li className="flex items-start gap-2"><Leaf className="w-4 h-4 mt-0.5 text-primary shrink-0" /> {t('AirDashboardTip2')}</li>
              <li className="flex items-start gap-2"><Leaf className="w-4 h-4 mt-0.5 text-primary shrink-0" /> {t('AirDashboardTip3')}</li>
            </ul>
            <button onClick={() => setIsInfoModalOpen(false)} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all cursor-pointer">
              {t('AirDashboardClose')}
            </button>
          </Card>
        </div>
      )}
    </section>
  )
}
