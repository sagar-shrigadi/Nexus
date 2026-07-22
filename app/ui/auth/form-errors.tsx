import { CircleAlert } from "lucide-react";

export default function AuthFormErrors({
  errorMessage,
}: {
  errorMessage: "Invalid Credentials." | "Something went wrong." | undefined;
}) {
  return (
    <div
      className={`${errorMessage ? "flex" : "hidden"} flex items-center gap-2`}
      aria-live="polite"
      aria-atomic="true"
    >
      {errorMessage && (
        <>
          <CircleAlert className="size-5 text-red-500" />
          <p className="text-red-500">{errorMessage}</p>
        </>
      )}
    </div>
  );
}
