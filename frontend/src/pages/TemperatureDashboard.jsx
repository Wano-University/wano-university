import { Card } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ArrowRight, 
  Download 
} from "lucide-react"

export default function TemperatureDashboard() {
  const sensors = [
    { id: 1, temp: "18°C" },
    { id: 2, temp: "18°C" },
    { id: 3, temp: "18°C" },
    { id: 4, temp: "18°C" },
    { id: 5, temp: "18°C" },
    { id: 6, temp: "18°C" },
  ]

  const stats = [
    { title: "Minimum Temperature", value: "12°C" }, 
    { title: "Average Temperature", value: "18°C" },
    { title: "Maximum Temperature", value: "24°C" },
  ]

  return (
    <div className="fixed inset-0 bg-background text-foreground font-sans antialiased px-12 flex items-center justify-center overflow-hidden transition-all duration-300">
      
      <main className="w-full max-w-7xl transition-all duration-300">
        <Card className="bg-card rounded-[2.5rem] p-10 border border-border shadow-md transition-all duration-300">
          
          <h1 className="text-4xl font-bold text-center mb-4 text-[#320088] dark:text-[#E0D0FF] tracking-tight transition-all duration-300">
            Temperature DashBoard
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-15">
            
            <div className="flex flex-col justify-start gap-6 mt-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 content-start w-full">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="bg-[#6338AF]/60 rounded-2xl py-8 px-8 flex items-center justify-between border border-transparent transition-all duration-300"
                  >
                    <div className="flex flex-col items-start justify-center text-left">
                      <p className="text-foreground font-bold text-xl tracking-tight mb-1 ml-1.5 opacity-90 transition-all duration-300">
                        Sensor {sensor.id}
                      </p>
                      <p className="text-5xl font-bold tracking-tighter text-white leading-none transition-all duration-300">
                        {sensor.temp}
                      </p>
                    </div>

                    <svg className="w-16 h-16 text-foreground stroke-[2.5] shrink-0 ml-5 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
                    </svg>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 shrink-0">
                <button className="bg-foreground text-background text-sm px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-70 transition-all duration-300">
                  Edit ✏️
                </button>
                <button className="bg-foreground text-background p-3 rounded-full hover:opacity-70 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 stroke-[3]" />
                </button>
                <button className="bg-foreground text-background p-3 rounded-full hover:opacity-70 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
                <button className="bg-foreground text-background text-sm px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-70 transition-all duration-300">
                  Export <Download className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              
              <div className="bg-[#6338AF]/60 rounded-2xl p-6 grid grid-cols-3 gap-4 border border-transparent transition-all duration-300">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-[#6338AF]/60 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[190px]">
                    <p className="text-[#FFFFFF] sm:text-base md:text-xl tracking-tight leading-tight text-center w-full transition-all duration-300">
                      {stat.title}
                    </p>
                    <svg className="w-16 h-16 text-foreground stroke-[2] transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
                    </svg>
                    <p className="font-bold text-white tracking-tight text-3xl sm:text-4xl text-center w-full">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-[#6338AF]/60 rounded-2xl p-7 relative flex flex-col justify-between flex-1 min-h-[300px] border-transparent transition-all duration-300">
                <div className="text-[#320088] dark:text-[#E0D0FF] font-bold text-3xl text-center transition-all duration-300">
                  Average Temperature Per Hour
                </div>
                <div className="flex-1 w-full relative flex items-end">
                  <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-lg font-bold text-[#320088] dark:text-[#FFFFFF] transition-all duration-300">
                      Temperature
                  </div>
                  <svg className="w-full h-[190px] ml-6 mb-2" viewBox="0 0 600 120" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="0" y2="120" stroke="currentColor" className="text-foreground" strokeWidth="8.0" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="currentColor" className="text-foreground" strokeWidth="4.0" />
                    
                    <polyline fill="none" stroke="#f87171" strokeWidth="5.0" points="60,95 140,88 220,45" />
                    <polyline fill="none" stroke="#4ade80" strokeWidth="5.0" points="220,45 320,60 400,68 480,15 560,32" />

                    <circle cx="60" cy="95" r="6" className="fill-foreground" />
                    <circle cx="140" cy="88" r="6" className="fill-foreground" />
                    <circle cx="220" cy="45" r="6" className="fill-foreground" />
                    <circle cx="320" cy="60" r="6" className="fill-foreground" />
                    <circle cx="400" cy="68" r="6" className="fill-foreground" />
                    <circle cx="480" cy="15" r="6" className="fill-foreground" />
                  </svg>
                </div>
                <div className="text-center text-xl font-bold text-[#320088] dark:text-[#FFFFFF] mt-2 ml-2 transition-all duration-300">
                  Hours
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}