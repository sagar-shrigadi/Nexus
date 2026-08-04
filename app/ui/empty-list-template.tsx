export default function EmptyListTemplate({
  content,
}: {
  content: "posts" | "comments" | "likes";
}) {
  return (
    <article className="min-h-50 h-full flex">
      <div className="grow flex justify-center items-center text-lg">
        <em className="my-auto">No {content} yet!</em>
      </div>
    </article>
  );
}
