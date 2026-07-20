import { EllipsisIcon, Heart, House, LogOut, Search } from "lucide-react";
import Navlink from "@/app/ui/navlink";
import { signOut, auth } from "@/auth";
import Link from "next/link";
import Image from "next/image";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav>
      <ul className="flex justify-between gap-6 px-2 py-2 sm:flex-col sm:justify-stretch sm:text-xl sm:min-h-dvh lg:min-w-60">
        <Navlink to="/">
          <House className="size-7.25" />
          <span className="hidden lg:block">Home</span>
        </Navlink>

        <Navlink to="/explore">
          <Search className="size-8" />
          <span className="hidden lg:block">Explore</span>
        </Navlink>

        <div className="flex justify-between items-center sm:mx-auto lg:mx-[unset] sm:mt-auto p-2">
          <div className="flex gap-5 items-center">
            <button
              popoverTarget="userAction"
              style={{ anchorName: `userPos` }}
              className="grow flex lg:hidden items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:underline transition-all"
            >
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-7.5 md:w-8.5 aspect-square block"
              />
              <span className="hidden lg:block">{`${session?.user?.name}`}</span>
            </button>
            <Link
              href={`/${session?.user?.email}`}
              className="grow hidden lg:flex items-center gap-3.5 cursor-pointer text-lg sm:text-xl hover:underline transition-all"
            >
              <Image
                src="/images/defaultProfile.png"
                width={180}
                height={180}
                alt="default image avatar for user"
                className="rounded-full w-7.5 md:w-8.5 aspect-square block"
              />
              <span className="hidden lg:block">{`${session?.user?.name}`}</span>
            </Link>
          </div>
          <button
            popoverTarget="userAction"
            style={{ anchorName: `userPos` }}
            className="hidden lg:block cursor-pointer hover:bg-(--hover) px-1 rounded-full transition-colors"
          >
            <EllipsisIcon className="size-6" />
          </button>
          <div
            id="userAction"
            aria-atomic="true"
            popover="auto"
            style={{ positionAnchor: `userPos` }}
            className="absolute [position-area:top_left] sm:[position-area:top_center] sm:ml-px lg:[position-area:top_left] rounded shadow-md mb-2 md:mb-4 md:ml-[unset]"
          >
            <div className="text-base flex flex-col items-start gap-2 p-2">
              <Link
                href={`/${session?.user?.email}/likes`}
                className="w-full flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <Heart className="size-6" />
                <span className="hidden lg:block">Likes</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
                className="mt-auto"
              >
                <button className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-200 transition-colors">
                  <LogOut className="size-6" />
                  <span className="hidden lg:block">Logout</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </ul>
    </nav>
  );
}
