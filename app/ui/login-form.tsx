"use client";
import { CircleAlert, CircleUserRound } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  return (
    <>
      <form action={formAction} className="w-full mt-5 flex flex-col gap-5">
        <div className="flex-1 flex flex-col ">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            required
            autoComplete="username"
            className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
          />
        </div>
        <div className="flex-1 flex flex-col ">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            required
            autoComplete="current-password"
            className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
          />
        </div>
        <p className="text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign Up
          </Link>
        </p>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <button
          aria-disabled={isPending}
          className="cursor-pointer py-2 px-6 rounded text-black bg-slate-200 hover:bg-slate-50 transition-colors"
        >
          Log in
        </button>
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
      </form>
      <form className="w-full flex">
        <button className="grow cursor-pointer border border-slate-50 hover:bg-slate-50 hover:text-black px-4 py-2 rounded transition-colors flex items-center justify-center gap-6">
          <CircleUserRound className="size-6" />
          Try a Demo Account
        </button>
      </form>
    </>
  );
}
