import { Suspense } from "react";
import ExploreSidebar from "@/app/ui/sidebar/explore-sidebar";
import ExploreFeed from "@/app/ui/feed/explore-feed";

export default async function Explore() {
  return (
    <main className="flex flex-1 w-full h-dvh mx-auto flex-col px-2 sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
      <Suspense>
        <ExploreFeed />
      </Suspense>
      <Suspense>
        <ExploreSidebar />
      </Suspense>
    </main>
  );
}
