import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Info, Zap, Battery, ArrowUp } from "lucide-react"

export default function EnergyConsumptionDashboard() {
  const sensors = [
    { id: 1, val: "200 W" }, { id: 3, val: "1200 W" },
    { id: 2, val: "400 W" }, { id: 4, val: "500 W" },
    { id: 5, val: "100 W" }, { id: 6, val: "600 W" },
  ]

  return (
    <div className="fixed inset-0 bg-background text-foreground font-sans antialiased flex items-center justify-center p-6 transition-all duration-300">
      <main className="w-full max-w-7xl mx-auto transition-all duration-300">
        <Card className="bg-card rounded-[2.5rem] p-8 border border-border shadow-md transition-all duration-300">
          
          <h1 className="text-4xl font-bold text-center mb-8 text-[#320088] dark:text-[#E0D0FF] tracking-tight transition-all duration-300">
            Energy Consumption Dashboard
          </h1>

          <div className="grid grid-cols-2 gap-12 items-start">
            
            <div className="flex flex-col gap-3"> 
              <div className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 p-6 rounded-3xl flex items-center justify-between transition-all duration-300">
                <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-4xl text-center transition-all duration-300">Current <br /> Power</div>
                <div className="text-5xl font-bold text-white tracking-tighter transition-all duration-300">3000 W</div>
                <Battery className="w-16 h-16 text-black dark:text-[#E0D0FF] transition-all duration-300" />
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                {sensors.map((s) => (
                  <div key={s.id} className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 p-6 rounded-3xl flex justify-between items-center">
                    <div>
                      <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-2xl transition-all duration-300">Sensor {s.id}</div>
                      <div className="text-5xl font-bold text-white tracking-tighter transition-all duration-300">{s.val}</div>
                    </div>
                    <Zap className="w-12 h-12 text-black dark:text-[#E0D0FF] transition-all duration-300" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-4 mt-2">
                <Info className="w-10 h-10 text-foreground transition-all duration-300" />
                <div className="flex items-center justify-center gap-2 -ml-15">
                  <button className="bg-foreground text-background text-md px-10 py-3 rounded-full font-bold transition-all duration-300">Edit ✏️</button>
                  <button className="bg-foreground text-background p-3 rounded-full transition-all duration-300"><ArrowLeft className="w-6 h-6" /></button>
                  <button className="bg-foreground text-background p-3 rounded-full transition-all duration-300"><ArrowRight className="w-6 h-6" /></button>
                  <button className="bg-foreground text-background text-md px-10 py-3 rounded-full font-bold transition-all duration-300">Export</button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              
              <div className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 p-5 rounded-3xl relative flex items-center">
                <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-4xl leading-none w-[140px] text-center transition-all duration-300">
                  Today's<br />Peak
                </div>
                <div className="absolute left-0 right-0 flex justify-center items-center pointer-events-none">
                  <div className="flex flex-col items-center pointer-events-auto">
                    <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-2xl transition-all duration-300">Sensor 1</div>
                    <div className="text-5xl font-bold text-white tracking-tighter transition-all duration-300">2000 W</div>
                  </div>
                </div>
                <div className="ml-auto">
                    <ArrowUp className="w-16 h-16 text-black dark:text-[#E0D0FF] transition-all duration-300" />
                </div>
              </div>

              <div className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 p-6 rounded-3xl text-center">
                <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-4xl transition-all duration-300">Today's Total Consumption</div>
                <div className="text-7xl font-bold text-white tracking-[0.04em] mt-1 transition-all duration-300">
                  15000 W
                </div>              
              </div>

              <div className="bg-[#6338AF]/60 dark:bg-[#4A2D7A]/80 rounded-3xl p-6 relative flex flex-col justify-between flex-1 min-h-[260px]">
                <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-3xl text-center transition-all duration-300">Average Consumption Per Day</div>
                <div className="flex-1 w-full relative flex items-end">
                   <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-lg font-bold text-[#320088] dark:text-[#E0D0FF] transition-all duration-300">
                      Power
                  </div>
                  <svg className="w-full h-[150px] ml-6 mb-2" viewBox="0 0 600 120" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="0" y2="120" stroke="white" strokeWidth="8.0" strokeOpacity="0.5" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="white" strokeWidth="4.0" strokeOpacity="0.5" />
                    <polyline fill="none" stroke="#FDA4AF" strokeWidth="5.0" points="60,95 140,88 220,45" />
                    <polyline fill="none" stroke="#86EFAC" strokeWidth="5.0" points="220,45 320,60 400,68 480,15 560,32" />
                  </svg>
                </div>
                <div className="text-center text-xl font-bold text-[#320088] dark:text-[#E0D0FF] ml-2 transition-all duration-300">
                  Days
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}