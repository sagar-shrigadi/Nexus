import FollowUserForm from "@/app/ui/user/follow-user-form";
import { auth } from "@/auth";
import UserNameCard from "@/app/ui/user/name-card";

export default async function FollowUserCard({
  user,
  usersFollowedByUser,
}: {
  user: {
    id: number;
    username: string;
    fullname: string;
  };
  usersFollowedByUser: {
    follows: number;
  }[];
}) {
  const session = await auth();
  return (
    <li className="flex justify-between items-center px-4 py-1.5">
      <UserNameCard
        className="flex gap-6"
        to={`/${user.username}`}
        fullname={user.fullname}
        username={user.username}
      />
      <FollowUserForm
        session={session}
        userToFollow={{ id: user.id, username: user.username }}
        usersFollowed={usersFollowedByUser}
      />
    </li>
  );
}
