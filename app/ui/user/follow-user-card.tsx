import FollowUserForm from "@/app/ui/user/follow-user-form";
import { auth } from "@/auth";
import UserNameCard from "@/app/ui/user/name-card";

export default async function FollowUserCard({
  user,
}: {
  user: {
    id: number;
    username: string;
    fullname: string;
    isFollowed: boolean;
  };
}) {
  const session = await auth();
  return (
    <li className="flex justify-between items-center gap-4 px-4 py-1.5 border rounded">
      <UserNameCard
        className="flex gap-6"
        to={`/${user.username}`}
        fullname={user.fullname}
        username={user.username}
      />
      <FollowUserForm
        session={session}
        user={{
          id: user.id,
          username: user.username,
          isFollowed: user.isFollowed,
        }}
      />
    </li>
  );
}
