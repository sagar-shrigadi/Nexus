import {
  allUsersFollowedByUser,
  getMostFollowedUsersExcludingUser,
} from "@/app/services/users";
import SidebarWrapper from "@/app/ui/sidebar/sidebar-wrapper";
import FollowUserCard from "@/app/ui/user/follow-user-card";
import { auth } from "@/auth";

export default async function ExploreSidebar() {
  const session = await auth();
  const users = await getMostFollowedUsersExcludingUser(
    Number(session?.user?.id),
  );
  const usersFollowedByUser = await allUsersFollowedByUser(
    Number(session?.user?.id),
  );
  return (
    <SidebarWrapper className="gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="text-xl lg:text-2xl font-bold my-2 ml-4">
          Trending Users
        </h2>
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
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl lg:text-2xl font-bold mt-3 mb-2 px-4">
          Trends For You
        </h2>
        <div className="flex flex-col gap-6">
          <div className="p-4">
            <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
          </div>
          <div className="p-4">
            <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
          </div>
          <div className="p-4">
            <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
          </div>
          <div className="p-4">
            <h3 className="text-lg cursor-pointer">Lorem ipsum dolor</h3>
          </div>
        </div>
      </section>
    </SidebarWrapper>
  );
}
