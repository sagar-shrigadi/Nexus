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
import { auth } from "@/auth";
import { getUserAvatar } from "@/app/services/users";

export default async function Navbar() {
  const session = await auth();
  const user = await getUserAvatar(Number(session?.user?.id));
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
                      src={user?.avatar ?? "/images/defaultProfile.png"}
                      alt={user?.avatar ? "User Avatar" : "Default User Avatar"}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              }
            />
            <div className="grow hidden lg:flex items-center gap-4">
              <UserNameCard
                className="flex"
                to={`/${session?.user?.email}`}
                fullname={session!.user!.name!}
                userAvatar={user?.avatar}
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
                      href={`/${session?.user?.email}`}
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
