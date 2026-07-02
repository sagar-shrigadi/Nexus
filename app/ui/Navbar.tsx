import { CircleUserRound, Heart, House, Search, Settings } from "lucide-react";
import Navlink from "@/app/ui/Navlink";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex justify-between gap-6 px-4 py-2 sm:flex-col sm:justify-stretch sm:text-xl sm:min-h-dvh">
        <Navlink to="/">
          <House className="size-7.25" />
          <span className="hidden lg:block">Home</span>
        </Navlink>

        <Navlink to="/explore">
          <Search className="size-8" />
          <span className="hidden lg:block">Explore</span>
        </Navlink>

        <Navlink to="/likes">
          <Heart className="size-8" />
          <span className="hidden lg:block">Likes</span>
        </Navlink>

        <Navlink to="/profile">
          <CircleUserRound className="size-8" />
          <span className="hidden lg:block">Profile</span>
        </Navlink>

        <Navlink to="/settings">
          <Settings className="size-8" />
          <span className="hidden lg:block">Settings</span>
        </Navlink>
      </ul>
    </nav>
  );
}
