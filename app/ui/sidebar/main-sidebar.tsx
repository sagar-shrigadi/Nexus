import {
  allUsersFollowedByUserWithId,
  getRandomUsersExcludingUser,
} from "@/app/services/users";
import SidebarWrapper from "@/app/ui/sidebar/sidebar-wrapper";
import FollowUserCard from "@/app/ui/user/follow-user-card";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MainSidebar() {
  const session = await auth();
  const users = await getRandomUsersExcludingUser(Number(session?.user?.id));
  const followedUsers = await allUsersFollowedByUserWithId(
    Number(session?.user?.id),
  );
  const followedUsersId = new Set(followedUsers.map((u) => u.follows));
  return (
    <SidebarWrapper>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl lg:text-2xl font-bold">Suggested Users</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {users.map((user) => (
              <FollowUserCard
                key={user.id}
                user={{
                  id: user.id,
                  username: user.username,
                  fullname: `${user.firstName} ${user.lastName}`,
                  isFollowed: followedUsersId.has(user.id),
                }}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </SidebarWrapper>
  );
}
