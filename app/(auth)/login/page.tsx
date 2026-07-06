import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";

export default function Login() {
  return (
    <section className="flex flex-col gap-4 items-center justify-center m-auto p-4 w-dvw max-w-136">
      <h1 className="text-4xl mr-auto">Welcome Back</h1>
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
