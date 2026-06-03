import { Link } from "react-router-dom";
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { logoutUser } from "../lib/auth";

export default function Navbar() {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <nav className="flex items-center justify-between px-16 py-4 border-b sticky top-0 bg-background/25 backdrop-blur-sm z-50">
      <Link to={user ? "/home" : "/"}>
        <span className="font-bold text-xl">Wano University</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/home" className="hover:text-primary transition-colors">Home</Link>

        {/* Not Logged In */}
        {!user && (
          <>
            <Link to="/createacc" className="hover:text-primary transition-colors">Create Account</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
          </>
        )}

        {/* Admin Only */}
        {user?.type === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="hover:text-primary transition-colors">Admin Panel</Link>
            <Link to="/admin/users" className="hover:text-primary transition-colors">Manage Users</Link>
          </>
        )}

        {/* Staff Only */}
        {user?.type === 'STAFF' && (
          <>
            <Link to="/staff/courses" className="hover:text-primary transition-colors">Manage Courses</Link>
            <Link to="/staff/grades" className="hover:text-primary transition-colors">Upload Grades</Link>
          </>
        )}

        {/* 3. Student Only */}
        {user?.type === 'STUDENT' && (
          <>
            <Link to="/student/schedule" className="hover:text-primary transition-colors">My Schedule</Link>
            <Link to="/student/grades" className="hover:text-primary transition-colors">My Grades</Link>
          </>
        )}

        {/* Any Logged In User */}
        {user && (
          <Button variant="ghost" onClick={logoutUser}>
            Logout ({user.login})
          </Button>
        )}

        <ModeToggle />
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-4">
        <ModeToggle />
        <Sheet>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-foreground/80 hover:text-foreground">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col gap-6 pt-16 px-6">
            <Link to="/home" className="text-lg font-medium hover:text-primary transition-colors">
              Home
            </Link>

            {/* Not Logged In */}
            {!user && (
              <>
                <Link to="/createacc" className="text-lg font-medium hover:text-primary transition-colors">
                  Create Account
                </Link>
                <Link to="/login" className="text-lg font-medium hover:text-primary transition-colors">
                  Login
                </Link>
              </>
            )}

            {/* Admin Only */}
            {user?.type === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className="text-lg font-medium hover:text-primary transition-colors">
                  Admin Panel
                </Link>
                <Link to="/admin/users" className="text-lg font-medium hover:text-primary transition-colors">
                  Manage Users
                </Link>
              </>
            )}

            {/* Staff Only */}
            {user?.type === 'STAFF' && (
              <>
                <Link to="/staff/courses" className="text-lg font-medium hover:text-primary transition-colors">
                  Manage Courses
                </Link>
                <Link to="/staff/grades" className="text-lg font-medium hover:text-primary transition-colors">
                  Upload Grades
                </Link>
              </>
            )}

            {/* 3. Student Only */}
            {user?.type === 'STUDENT' && (
              <>
                <Link to="/student/schedule" className="text-lg font-medium hover:text-primary transition-colors">
                  My Schedule
                </Link>
                <Link to="/student/grades" className="text-lg font-medium hover:text-primary transition-colors">
                  My Grades
                </Link>
              </>
            )}

            {/* Any Logged In User */}
            {user && (
              <Button onClick={logoutUser} className="w-full mt-4">
                Logout ({user.login})
              </Button>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
