import FollowUserForm from "@/app/ui/user/follow-user-form";
import UserNameCard from "@/app/ui/user/name-card";

export default async function FollowUserCard({
  users,
}: {
  users: {
    id: number;
    username: string;
    fullname: string;
    avatar: {
      publicUrl: string;
    } | null;
    isFollowed: boolean;
  };
}) {
  return (
    <li className="flex justify-between items-center gap-4 px-4 py-1.5 border rounded">
      <UserNameCard
        className="flex gap-6"
        to={`/${users.username}`}
        fullname={users.fullname}
        username={users.username}
        userAvatar={users.avatar?.publicUrl}
      />
      <FollowUserForm
        userToFollow={{
          id: users.id,
          username: users.username,
          isFollowed: users.isFollowed,
        }}
      />
    </li>
  );
}
