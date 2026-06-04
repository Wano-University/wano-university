import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { logoutUser } from "../lib/auth";

export default function UserAvatar({ user }) {
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full border border-border bg-background shadow-sm hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <User className="h-5 w-5 text-foreground/80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.login}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.type}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile/customize" className="cursor-pointer w-full">Customize</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/tickets" className="cursor-pointer w-full">Tickets</Link>
        </DropdownMenuItem>

        {(user.type === 'STUDENT' || user.type === 'PROFESSOR') && (
          <DropdownMenuItem asChild>
            <Link to="/reservations" className="cursor-pointer w-full">Reservations</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/changepassword" className="cursor-pointer w-full">Change Password</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logoutUser} className="cursor-pointer w-full">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
