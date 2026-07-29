import { Suspense } from "react";
import ExploreSidebar from "@/app/ui/sidebar/explore-sidebar";
import ExploreFeed from "@/app/ui/feed/explore-feed";

export default async function Explore() {
  return (
    <>
      <Suspense>
        <ExploreFeed />
      </Suspense>
      <Suspense>
        <ExploreSidebar />
      </Suspense>
    </>
  );
}
