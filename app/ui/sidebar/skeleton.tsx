import SidebarWrapper from "@/app/ui/sidebar/sidebar-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowUserCardSkeletion } from "@/app/ui/user/skeleton";

export function MainSidebarSkeleton() {
  return (
    <SidebarWrapper>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-2/3 h-8 mr-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 10 }, (_, i) => (
              <FollowUserCardSkeletion key={i} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </SidebarWrapper>
  );
}
export function ExploreSidebarSkeleton() {
  return (
    <SidebarWrapper className="gap-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-2/3 h-8 mr-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <FollowUserCardSkeletion key={i} />
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="w-2/3 h-8 mr-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <FollowUserCardSkeletion key={i} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </SidebarWrapper>
  );
}
