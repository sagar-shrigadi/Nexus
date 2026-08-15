import { BadgeCheck, Ellipsis, House, LogOut, Search } from "lucide-react";
import Navlink from "@/app/ui/nav/navlink";
import Link from "next/link";
import UserNameCard from "@/app/ui/user/name-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getUserAvatar } from "@/app/services/users";
import { User } from "next-auth";

export default async function Navbar({ sessionUser }: { sessionUser: User }) {
  const user = await getUserAvatar(Number(sessionUser.id));
  return (
    <nav>
      <ul className="flex justify-between gap-6 p-2 sm:p-4 sm:flex-col sm:justify-stretch sm:text-xl sm:h-svh lg:min-w-60">
        <Navlink to="/">
          <House className="size-7" />
          <span className="hidden lg:block">Home</span>
        </Navlink>

        <Navlink to="/explore">
          <Search className="size-7" />
          <span className="hidden lg:block">Explore</span>
        </Navlink>

        <li className="my-auto sm:my-[unset] sm:mt-auto flex justify-between px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "icon",
                    }),
                    "lg:hidden",
                  )}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.avatar?.publicUrl ?? "/images/defaultProfile.png"
                      }
                      alt={
                        user?.avatar?.publicUrl
                          ? "User Avatar"
                          : "Default User Avatar"
                      }
                    />
                    <AvatarFallback>
                      {sessionUser.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              }
            />
            <div className="grow hidden lg:flex items-center gap-4">
              <UserNameCard
                className="flex"
                to={`/${sessionUser.email}`}
                fullname={sessionUser.name!}
                userAvatar={user?.avatar?.publicUrl}
              />
              <DropdownMenuTrigger
                render={
                  <button
                    className={cn(
                      buttonVariants({
                        variant: "outline",
                        size: "icon",
                      }),
                    )}
                  >
                    <Ellipsis />
                  </button>
                }
              />
            </div>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/${sessionUser.email}`}
                      className="flex items-center gap-1.5"
                    >
                      <BadgeCheck />
                      Profile
                    </Link>
                  }
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  render={
                    <form action={logout}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5"
                      >
                        <LogOut />
                        Sign Out
                      </button>
                    </form>
                  }
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
}
