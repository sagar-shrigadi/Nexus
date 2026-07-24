import GuestLoginForm from "@/app/ui/auth/guest-login-form";
import LoginForm from "@/app/ui/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";

export default function Page() {
  return (
    <article className="m-auto w-dvw max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          <Suspense>
            <LoginForm />
            <GuestLoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </article>
  );
}
