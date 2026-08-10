import { notFound } from "next/navigation";
import {
  getIdsOfAllLikedPostsAndLikedCommentsByUser,
  getAllPostsAndCommentsAndLikedPostsAndLikedCommentsByUser,
  isUserFollowedByUserWithId,
} from "@/app/services/users";
import BackButton from "@/app/ui/button/back-button";
import PostCard from "@/app/ui/post/post-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";
import FollowUserForm from "@/app/ui/user/follow-user-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentCard from "@/app/ui/comment/comment-card";
import EmptyListTemplate from "@/app/ui/empty-list-template";
import UploadAvatar from "@/app/ui/user/upload-user-avatar";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth();
  const { username } = await params;
  const user =
    await getAllPostsAndCommentsAndLikedPostsAndLikedCommentsByUser(username);
  if (!user) {
    notFound();
  }
  const isFollowed = await isUserFollowedByUserWithId(
    Number(session?.user?.id),
    user.id,
  );
  const likedPostsAndLikedCommentsIdsByUser =
    await getIdsOfAllLikedPostsAndLikedCommentsByUser(
      Number(session?.user?.id),
    )!;
  const likedPostsId = new Set(
    likedPostsAndLikedCommentsIdsByUser?.likedPosts.map((p) => p.postId),
  );
  const likedCommentsId = new Set(
    likedPostsAndLikedCommentsIdsByUser?.likedComments.map((c) => c.commentId),
  );

  return (
    <div className="mr-auto w-full h-[91svh] sm:h-svh max-w-3xl flex flex-col">
      <header className="flex items-center gap-4 px-2 py-4">
        <BackButton />
        <h2 className="text-2xl">{`${user.firstName} ${user.lastName}`}</h2>
      </header>
      <ScrollArea className="grow min-h-0 border rounded">
        <section className="flex flex-col pb-4">
          <div className="relative mb-15">
            {/* keep the margin-bottom here exactly half of the Avatar size from below */}
            <div className="w-full h-55 md:h-60 bg-muted" />
            <div className="px-4 absolute z-2 bottom-0 translate-y-1/2 flex justify-between w-full">
              <div className="flex">
                <Avatar className="size-30">
                  <AvatarImage
                    src={user.avatar?.publicUrl ?? "/images/defaultProfile.png"}
                    alt={
                      user.avatar?.publicUrl
                        ? "User Avatar"
                        : "Default User Avatar"
                    }
                    className="object-cover rounded-[4%]"
                  />
                  <AvatarFallback className="rounded-[4%]">
                    {"U"}
                  </AvatarFallback>
                </Avatar>
                {Number(session?.user?.id) === user.id && (
                  <UploadAvatar
                    user={{
                      id: user.id,
                      username: user.username,
                      avatarId: user.avatarId,
                      avatar: user.avatar,
                    }}
                  />
                )}
              </div>
              {session?.user?.email === username || (
                <FollowUserForm
                  session={session}
                  user={{
                    id: user.id,
                    username: user.username,
                    isFollowed: !!isFollowed,
                  }}
                  className="self-end"
                />
              )}
            </div>
          </div>
          <div className="px-4 pt-2 flex flex-col gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-lg text-sidebar-ring">@{user.username}</p>
            </div>
            <div className="text-lg">{user.bio}</div>
            <div className="flex items-center gap-4">
              <span>{user.following} following</span>
              <span>{user.followers} followers</span>
            </div>
          </div>
        </section>
        <section className="grow">
          <Tabs defaultValue="posts">
            <TabsList
              variant="line"
              className="w-full flex justify-between items-center px-4"
            >
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            <Separator />
            <TabsContent value="posts">
              {user.posts.length > 0 ? (
                user.posts.map((post, i) => (
                  <article key={post.id}>
                    {i > 0 && <Separator />}
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        userId: user.id,
                        isLiked: likedPostsId.has(post.id),
                        users: {
                          firstName: user.firstName,
                          lastName: user.lastName,
                          username: user.username,
                          avatar: user.avatar,
                        },
                      }}
                    />
                  </article>
                ))
              ) : (
                <EmptyListTemplate content="posts" />
              )}
            </TabsContent>
            <TabsContent value="comments">
              {user.comments.length > 0 ? (
                user.comments.map((comment, i) => (
                  <article key={comment.id}>
                    {i > 0 && <Separator />}
                    <CommentCard
                      session={session}
                      comment={{
                        ...comment,
                        userId: user.id,
                        isLiked: likedCommentsId.has(comment.id),
                        users: {
                          username: user.username,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          avatar: user.avatar,
                        },
                      }}
                    />
                  </article>
                ))
              ) : (
                <EmptyListTemplate content="comments" />
              )}
            </TabsContent>
            <TabsContent value="likes">
              {user.likedComments.length > 0 && user.likedPosts.length > 0 ? (
                <>
                  {user.likedComments.map((c, i) => (
                    <article key={c.id}>
                      {i > 0 && <Separator />}
                      <CommentCard
                        session={session}
                        comment={{
                          ...c.comments,
                          isLiked: likedCommentsId.has(c.comments.id),
                        }}
                      />
                    </article>
                  ))}
                  <Separator />
                  {user.likedPosts.map((p, i) => (
                    <article key={p.id}>
                      {i > 0 && <Separator />}
                      <PostCard
                        key={p.id}
                        post={{
                          ...p.posts,
                          isLiked: likedPostsId.has(p.posts.id),
                        }}
                      />
                    </article>
                  ))}
                </>
              ) : (
                <EmptyListTemplate content="likes" />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </ScrollArea>
    </div>
  );
}
