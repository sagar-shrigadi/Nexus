import {
  allUsersFollowedByUserWithId,
  getRandomUsersExcludingUser,
} from "@/app/services/users";
import SidebarWrapper from "@/app/ui/sidebar/sidebar-wrapper";
import FollowUserCard from "@/app/ui/user/follow-user-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "next-auth";

export default async function MainSidebar({
  sessionUser,
}: {
  sessionUser: User;
}) {
  const users = await getRandomUsersExcludingUser(Number(sessionUser.id));
  const followedUsers = await allUsersFollowedByUserWithId(
    Number(sessionUser.id),
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
    </SidebarWrapper>
  );
}
