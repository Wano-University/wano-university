import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Wind, Cloud, Leaf, AlertTriangle } from "lucide-react"

export default function AirQualityDashboard() {
  const sensors = [
    { id: 1, status: "Excellent", iqa: 45, pm: "4 µg/m³", color: "text-green-500" },
    { id: 2, status: "Moderate", iqa: 60, pm: "7 µg/m³", color: "text-yellow-500" },
    { id: 3, status: "Poor", iqa: 90, pm: "8 µg/m³", color: "text-red-500" },
    { id: 4, status: "Excellent", iqa: 49, pm: "5 µg/m³", color: "text-green-500" },
  ]

  return (
    <div className="fixed inset-0 bg-background text-foreground font-sans antialiased flex items-center justify-center p-6 transition-all duration-300">
      <main className="w-full max-w-7xl mx-auto transition-all duration-300">
        <Card className="bg-card rounded-[2.5rem] p-8 border border-border shadow-md transition-all duration-300">
          
          <h1 className="text-4xl font-bold text-center mb-8 text-[#320088] dark:text-[#E0D0FF] tracking-tight transition-all duration-300">
            Air Quality DashBoard
          </h1>

          <div className="grid grid-cols-4 gap-12 mb-6 transition-all duration-300">
            {[
              { label: "Average PM2.5", val: "6 µg/m³", icon: Cloud },
              { label: "Average IQA", val: "61", icon: Wind },
              { label: "Good IQA", val: "2 / 4", icon: Leaf },
              { label: "Worst IQA", val: "Sensor 3", icon: AlertTriangle },
            ].map((item, i) => (
              <div key={i} className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 p-4 rounded-3xl flex items-center transition-all duration-300">
                <div className="flex-1 flex flex-col">
                  <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-2xl text-center">
                    {item.label}
                  </div>
                  <div className="text-4xl font-bold text-white tracking-tighter text-center mt-2">
                    {item.val}
                  </div>
                </div>
                <div className="ml-3">
                  <item.icon className="w-12 h-12 text-black dark:text-[#E0D0FF] transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-6 transition-all duration-300">
            {sensors.map((s) => (
              <div key={s.id} className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 p-8 rounded-3xl flex justify-between items-center transition-all duration-300">
                <div>
                  <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-3xl mb-2 transition-all duration-300">Sensor {s.id}</div>
                  <div className={`font-bold text-3xl ${s.color}`}>{s.status}</div>
                  <div className="text-3xl font-semibold text-white/90">PM2.5 : {s.pm}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-5xl font-bold text-white tracking-tighter">IQA {s.iqa}</div>
                </div>
                <Wind className="w-16 h-16 text-black dark:text-[#E0D0FF] transition-all duration-300" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 transition-all duration-300">
            <button className="bg-foreground text-background text-md px-10 py-3 rounded-full font-bold transition-all duration-300"> Edit ✏️ </button>
            <button className="bg-foreground text-background p-3 rounded-full transition-all duration-300">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button className="bg-foreground text-background p-3 rounded-full transition-all duration-300">
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="bg-foreground text-background text-md px-10 py-3 rounded-full font-bold transition-all duration-300"> Export </button>
          </div>
        </Card>
      </main>
    </div>
  )
}