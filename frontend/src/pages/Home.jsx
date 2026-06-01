import { CardContent, CardTitle } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { MonitorSmartphone } from "lucide-react"
import { Utensils } from "lucide-react"
import { CarFront } from "lucide-react"
import { Terminal } from "lucide-react"
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (

    <section id="create" className="py-24 max-w-7xl mx-auto px-6">

      <div className="grid grid-cols-1 md:grid-cols-2 md:row-span-3 gap-6">
        <Card 
          onClick={() => navigate('/map')} 
          className="col-span-1 row-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <MonitorSmartphone className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Spaces</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Reserve a room, laboratory or equipment
          </p>
        </Card>

        <Card 
          onClick={() => navigate('/cafeteria')} 
          className="col-span-1 row-span-2 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Utensils className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Cafeteria</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            View our  weekly menu and buy tickets to try our amazing meals!
          </p>
        </Card>
        <Card className="col-span-1 row-span-1 p-6 shadow-lg border-border hover:shadow-xl hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <CarFront className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Parking Lot</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Reserve a parking space for your personal vehicle or reserve one of our sustainable options
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
      </div>
    </section>
  )
}
