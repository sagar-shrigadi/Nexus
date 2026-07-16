export default function PostContentCard({
  post,
}: {
  post: {
    title: string;
    content: string;
    id: number;
    userId: number;
    users?: {
      firstName: string;
      lastName: string;
      username: string;
    };
  };
}) {
  return (
    <div className="flex flex-col mx-auto gap-1 cursor-pointer max-w-[75ch] px-4 py-1">
      <h3 className="sm:text-lg font-bold">{post.title}</h3>
      <p className="line-clamp-4">{post.content}</p>
    </div>
  );
}
