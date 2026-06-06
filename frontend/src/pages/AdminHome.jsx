import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MonitorSmartphone, Utensils, CarFront, Terminal, LayoutDashboard, Target } from "lucide-react"
import { getTodaysMeal } from "@/lib/menu"
import { getImageUrl } from "@/lib/utils"
import { Link } from "react-router-dom"

export default function AdminHome() {
  const [todayDish, setTodayDish] = useState(null);

  useEffect(() => {
    getTodaysMeal().then(setTodayDish);
  }, []);

  return (
    <section id="create" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card className="col-span-1 row-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <Link to={"/map"}>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <MonitorSmartphone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-3">Spaces</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Register and manage rooms, laboratories or equipments.
            </p>
          </Link>
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

        <Card className="col-span-1 row-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <CarFront className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Mobility</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Register parking spaces and sustainable vehicles for reservation.
          </p>
        </Card>

        <Card className="col-span-1 row-span-1 md:col-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Sensors</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Register and manage Temperature, Air Quality and Energy Comsumption sensors.
          </p>
        </Card>

        <Card className="col-span-1 row-span-1 md:col-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Dashboards</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            View Sensor's data in real time and generate reports.
          </p>
        </Card>

        <Card className="col-span-1 row-span-1 md:col-span-2 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">

          <Link to={"/Lssdocs"} className="flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Terminal className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Terminal</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Learn our System-Specific language in order to perform complex tasks efficiently.
          </p>
        </Link>
        </Card>

      </div>
    </section>
  )
}
