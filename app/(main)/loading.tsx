import { MainFeedSkeleton } from "@/app/ui/feed/skeleton";
import { MainSidebarSkeleton } from "@/app/ui/sidebar/skeleton";

export default function Skeleton() {
  return (
    <>
      <MainFeedSkeleton />
      <MainSidebarSkeleton />
    </>
  );
}
