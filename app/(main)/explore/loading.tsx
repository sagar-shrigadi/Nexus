import { ExploreFeedSkeleton } from "@/app/ui/feed/skeleton";
import { ExploreSidebarSkeleton } from "@/app/ui/sidebar/skeleton";

export default function ExploreSkeleton() {
  return (
    <>
      <ExploreFeedSkeleton />
      <ExploreSidebarSkeleton />
    </>
  );
}
