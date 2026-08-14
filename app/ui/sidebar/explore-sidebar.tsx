import {
  allUsersFollowedByUserWithId,
  getMostFollowedUsersExcludingUser,
} from "@/app/services/users";
import SidebarWrapper from "@/app/ui/sidebar/sidebar-wrapper";
import FollowUserCard from "@/app/ui/user/follow-user-card";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExploreSidebar() {
  const session = await auth();
  const users = await getMostFollowedUsersExcludingUser(
    Number(session?.user?.id),
  );
  const followedUsers = await allUsersFollowedByUserWithId(
    Number(session?.user?.id),
  );
  const followedUsersId = new Set(followedUsers.map((u) => u.follows));
  return (
    <SidebarWrapper className="gap-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl lg:text-2xl font-bold">Trending Users</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {users.map((user) => (
              <FollowUserCard
                key={user.id}
                users={{
                  id: user.id,
                  username: user.username,
                  fullname: `${user.firstName} ${user.lastName}`,
                  avatar: user.avatar,
                  isFollowed: followedUsersId.has(user.id),
                }}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl lg:text-2xl font-bold">Trends For You</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3.5">
            <div className="px-4 py-3 border rounded">
              <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
            </div>
            <div className="px-4 py-3 border rounded">
              <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
            </div>
            <div className="px-4 py-3 border rounded">
              <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
            </div>
            <div className="px-4 py-3 border rounded">
              <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </SidebarWrapper>
  );
}
