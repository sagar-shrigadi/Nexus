import SignUpForm from "@/app/ui/auth/signup-form";
import { Suspense } from "react";

export default function SignUp() {
  return (
    <section className="flex flex-col gap-4 items-center justify-center m-auto p-4 w-dvw max-w-136">
      <h1 className="text-4xl mr-auto">Please Sign Up</h1>
      <Suspense>
        <SignUpForm />
      </Suspense>
    </section>
  );
}
