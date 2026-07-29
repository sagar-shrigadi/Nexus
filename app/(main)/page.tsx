import MainSidebar from "@/app/ui/sidebar/main-sidebar";
import { Suspense } from "react";
import MainFeed from "@/app/ui/feed/main-feed";

export default async function Page() {
  return (
    <>
      <Suspense>
        <MainFeed />
      </Suspense>
      <Suspense>
        <MainSidebar />
      </Suspense>
    </>
  );
}
