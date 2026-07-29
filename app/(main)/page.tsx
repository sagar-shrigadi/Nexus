import MainSidebar from "@/app/ui/sidebar/main-sidebar";
import { Suspense } from "react";
import MainFeed from "@/app/ui/feed/main-feed";

export default async function Page() {
  return (
    <main className="flex flex-1 w-full h-dvh mx-auto flex-col px-2 sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
      <Suspense>
        <MainFeed />
      </Suspense>
      <Suspense>
        <MainSidebar />
      </Suspense>
    </main>
  );
}
