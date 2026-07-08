"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { register } from "@/app/lib/actions/auth";
import { CircleAlert } from "lucide-react";

export default function SignUp() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    register,
    undefined,
  );
  return (
    <form action={formAction} className="w-full mt-5 flex flex-col gap-5">
      <div className="flex-1 flex flex-col">
        <label htmlFor="firstname">First Name</label>
        <input
          type="text"
          name="firstname"
          id="firstname"
          required
          className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <label htmlFor="lastname">Last Name</label>
        <input
          type="text"
          name="lastname"
          id="lastname"
          required
          className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
        />
      </div>
      <div className="flex-1 flex flex-col">
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
      <div className="flex-1 flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          autoComplete="new-password"
          minLength={6}
          className="rounded-sm p-1 px-2 bg-dark-200 text-lg border"
        />
      </div>
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Login
        </Link>
      </p>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
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
      <button
        aria-disabled={isPending}
        className="cursor-pointer py-2 px-6 rounded text-black bg-slate-200 hover:bg-slate-50 transition-colors"
      >
        Sign Up
      </button>
    </form>
  );
}
