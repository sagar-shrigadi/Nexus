import {
  CircleUserRound,
  Heart,
  House,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import Navlink from "@/app/ui/navlink";
import { signOut, auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav>
      <ul className="flex justify-between gap-6 px-2 sm:px-4 py-2 sm:flex-col sm:justify-stretch sm:text-xl sm:min-h-dvh">
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

        <Navlink to={`/${session?.user?.email}`}>
          <CircleUserRound className="size-8" />
          <span className="hidden lg:block">Profile</span>
        </Navlink>

        <Navlink to="/settings">
          <Settings className="size-8" />
          <span className="hidden lg:block">Settings</span>
        </Navlink>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="mt-auto py-2"
        >
          <button className="flex items-center gap-4 cursor-pointer ">
            <LogOut className="size-8" />
            <span className="hidden lg:block">Logout</span>
          </button>
        </form>
      </ul>
    </nav>
  );
}
