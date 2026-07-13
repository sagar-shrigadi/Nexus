export default function DeleteForm({
  action,
  isPending,
}: {
  action: () => void;
  isPending: boolean;
}) {
  return (
    <form action={action}>
      <button
        aria-disabled={isPending}
        disabled={isPending}
        className="px-6 py-1.5 hover:bg-gray-200 rounded cursor-pointer transition-colors"
      >
        {isPending ? "Deleting" : "Delete"}
      </button>
    </form>
  );
}
