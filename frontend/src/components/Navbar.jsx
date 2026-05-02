import { Link } from "react-router-dom";
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react"

export default function Navbar() {

  return (
    <nav className="flex items-center justify-between px-16 py-4 border-b sticky top-0 bg-background/25 backdrop-blur-sm z-50">
      <Link to="/">
        <span className="font-bold text-xl">Wano University</span>
      </Link>

      <div className="hidden md:flex gap-8">
        <Link to="/">Home</Link>
      </div>

      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-foreground/80 hover:text-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col gap-6 pt-16 px-6">
            <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
              Home
            </Link>

          </SheetContent>
        </Sheet>
      </div>
    </nav >
  );
}
