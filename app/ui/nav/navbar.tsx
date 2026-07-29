import { BadgeCheck, Ellipsis, House, LogOut, Search } from "lucide-react";
import Navlink from "@/app/ui/nav/navlink";
import { signOut, auth } from "@/auth";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav>
      <ul className="flex justify-between gap-6 p-2 sm:p-4 sm:flex-col sm:justify-stretch sm:text-xl sm:h-dvh lg:min-w-60">
        <Navlink to="/">
          <House className="size-7" />
          <span className="hidden lg:block">Home</span>
        </Navlink>

        <Navlink to="/explore">
          <Search className="size-7" />
          <span className="hidden lg:block">Explore</span>
        </Navlink>

        <li className="my-auto sm:my-[unset] sm:mt-auto flex justify-between py-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex lg:hidden"
              render={
                <button
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "icon",
                    }),
                  )}
                >
                  <Avatar>
                    <AvatarImage
                      src={session?.user?.image ?? "/images/defaultProfile.png"}
                      alt={
                        session?.user?.image
                          ? "User Avatar"
                          : "Default User Avatar"
                      }
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
                fullname={`${session?.user?.name}`}
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
                <DropdownMenuItem className="cursor-pointer">
                  <Link
                    href={`/${session?.user?.email}`}
                    className="flex items-center gap-1.5"
                  >
                    <BadgeCheck />
                    Account
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/login" });
                    }}
                  >
                    <button className="flex items-center gap-1.5">
                      <LogOut />
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>
    </nav>
  );
}
