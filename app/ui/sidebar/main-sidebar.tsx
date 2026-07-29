import {
  allUsersFollowedByUser,
  getRandomUsersExcludingUser,
} from "@/app/services/users";
import SidebarWrapper from "@/app/ui/sidebar/sidebar-wrapper";
import FollowUserCard from "@/app/ui/user/follow-user-card";
import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MainSidebar() {
  const session = await auth();
  const users = await getRandomUsersExcludingUser(Number(session?.user?.id));
  const usersFollowedByUser = await allUsersFollowedByUser(
    Number(session?.user?.id),
  );
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
                }}
                usersFollowedByUser={usersFollowedByUser}
              />
            ))}
          </ul>
        </CardContent>
      </Card>
    </SidebarWrapper>
  );
}
