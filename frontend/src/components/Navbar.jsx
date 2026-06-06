import { Link } from "react-router-dom";
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Terminal as TerminalIcon } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";
import { useTerminal } from "./TerminalPopup";

const desktopLinkStyle = "text-base font-medium text-muted-foreground hover:text-primary hover:scale-105 px-3 py-2 transition-all duration-200 inline-block";
const mobileLinkStyle = "block w-full px-4 py-3 text-lg font-medium text-muted-foreground hover:text-primary hover:scale-[1.02] transition-all duration-200 origin-left";

export default function Navbar() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { openTerminal } = useTerminal();

  return (
    <nav className="flex items-center justify-between px-6 lg:px-16 py-4 border-b sticky top-0 bg-background/50 backdrop-blur-md z-50">
      <Link to={user ? "/home" : "/"}>
        <span className="font-bold text-xl hover:opacity-80 transition-opacity">Wano University</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-4">

        {!user && (
          <>
            <Link to="/createacc" className={desktopLinkStyle}>Create Account</Link>
            <Link to="/login" className={desktopLinkStyle}>Login</Link>
          </>
        )}

        {user?.type === 'ADMIN' && (
          <>
            <Link to="/map" className={desktopLinkStyle}>Spaces</Link>
            <Link to="/parking" className={desktopLinkStyle}>Mobility</Link>
            <Link to="/sensors" className={desktopLinkStyle}>Sensors</Link>
            <Link to="/cafeteria" className={desktopLinkStyle}>Cafeteria</Link>
            <Link to="/admin/dashboard" className={desktopLinkStyle}>Dashboards</Link>
            <Link to="/admin/users" className={desktopLinkStyle}>User Management</Link>
          </>
        )}

        {user?.type === 'STAFF' && (
          <>
            <Link to="/cafeteria" className={desktopLinkStyle}>Cafeteria</Link>
            <Link to="/sensors" className={desktopLinkStyle}>Sensors</Link>
            <Link to="/sensors/temperature" className={desktopLinkStyle}>Temperature</Link>
            <Link to="/sensors/air-quality" className={desktopLinkStyle}>Air Quality</Link>
          </>
        )}

        {(user?.type === 'STUDENT' || user?.type === 'PROFESSOR') && (
          <>
            <Link to="/map" className={desktopLinkStyle}>Spaces</Link>
            <Link to="/cafeteria" className={desktopLinkStyle}>Cafeteria</Link>
            <Link to="/parking" className={desktopLinkStyle}>Mobility</Link>
          </>
        )}

        {/* Desktop UI Tools */}
        {user && (
          <div className="flex items-center gap-3 border-l border-border pl-6 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200 cursor-pointer"
              title="Open Terminal"
              onClick={openTerminal}
            >
              <TerminalIcon className="h-5 w-5" />
            </Button>
            <ModeToggle />
            <UserAvatar user={user} />
          </div>
        )}

        {!user && <ModeToggle />}
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden flex items-center gap-2">
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
            title="Open Terminal"
            onClick={openTerminal}
          >
            <TerminalIcon className="h-5 w-5" />
          </Button>
        )}

        <ModeToggle />

        {user && <UserAvatar user={user} />}

        <Sheet>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-foreground/80 hover:text-foreground cursor-pointer">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col gap-2 pt-16 px-4 overflow-y-auto">

            {!user && (
              <>
                <Link to="/createacc" className={mobileLinkStyle}>Create Account</Link>
                <Link to="/login" className={mobileLinkStyle}>Login</Link>
              </>
            )}

            {user?.type === 'ADMIN' && (
              <>
                <Link to="/map" className={mobileLinkStyle}>Spaces</Link>
                <Link to="/parking" className={mobileLinkStyle}>Mobility</Link>
                <Link to="/sensors" className={mobileLinkStyle}>Sensors</Link>
                <Link to="/cafeteria" className={mobileLinkStyle}>Cafeteria</Link>
                <Link to="/admin/dashboard" className={mobileLinkStyle}>Dashboards</Link>
                <Link to="/admin/users" className={mobileLinkStyle}>User Management</Link>
              </>
            )}

            {user?.type === 'STAFF' && (
              <>
                <Link to="/cafeteria" className={mobileLinkStyle}>Cafeteria</Link>
                <Link to="/sensors" className={mobileLinkStyle}>Sensors</Link>
                <Link to="/sensors/temperature" className={mobileLinkStyle}>Temperature</Link>
                <Link to="/sensors/air-quality" className={mobileLinkStyle}>Air Quality</Link>
              </>
            )}

            {(user?.type === 'STUDENT' || user?.type === 'PROFESSOR') && (
              <>
                <Link to="/map" className={mobileLinkStyle}>Spaces</Link>
                <Link to="/cafeteria" className={mobileLinkStyle}>Cafeteria</Link>
                <Link to="/parking" className={mobileLinkStyle}>Mobility</Link>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
