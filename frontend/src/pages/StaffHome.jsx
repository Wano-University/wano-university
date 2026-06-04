import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Utensils } from "lucide-react"
import { Terminal } from "lucide-react"
import { Zap } from "lucide-react"
import { Target } from "lucide-react"
import { Fan } from "lucide-react"
import { Thermometer } from "lucide-react"
import { Link } from "react-router-dom"
import { getTodaysMeal } from "@/lib/menu"
import { getImageUrl } from "@/lib/utils"

export default function StaffHome() {
  const [todayDish, setTodayDish] = useState(null);

  useEffect(() => {
    getTodaysMeal().then(setTodayDish);
  }, []);

  return (

    <section id="create" className="py-24 max-w-7xl mx-auto px-6">

      <div className="grid grid-cols-1 md:grid-cols-2 md:row-span-3 gap-6">
        <Card className="col-span-1 row-span-1 md:col-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Sensors</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            View the location of Temperature, Air Quality and Energy Comsumption sensors.
          </p>
        </Card>

        <Card className="col-span-1 row-span-2 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col">
          <Link to={"/cafeteria"} className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 shrink-0">
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-3">Cafeteria</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Manage the weekly menu and register amazing new meals!
            </p>

            {todayDish && (
              <div className="hidden md:block mt-auto pt-5 border-t border-border">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary mb-3 block">
                  Today's Special
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-30 h-30 rounded-full overflow-hidden shrink-0 border-2 border-primary/20 shadow-sm bg-muted">
                    {todayDish.image && (
                      <img
                        src={getImageUrl(todayDish.image)}
                        alt={todayDish.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-foreground text-sm truncate">
                      {todayDish.title}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {todayDish.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Link>
        </Card>
        <Card className="col-span-1 row-span-1 md:col-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Fan className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Energy Comsumption</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            View the Air Quality in the Campus in real time and export reports.
          </p>
        </Card>
        <Card className="col-span-1 row-span-1 md:col-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Thermometer className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Energy Comsumption</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            View the Temperature in the Campus in real time and export reports.
          </p>
        </Card>
        <Card className="col-span-1 row-span-1 md:col-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Energy Comsumption</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            View the Energy Consumption in the Campus in real time and export reports.
          </p>
        </Card>
        <Card className="col-span-1 row-span-1 md:col-span-2 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Terminal</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Learn our System-Specific language in order to perform complex tasks efficiently
          </p>
        </Card>
      </div >
    </section >
  )
}

