import LoginForm from "@/app/ui/auth/login-form";
import { SkeletonForm } from "@/app/ui/auth/skeleton";
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
          <Suspense fallback={<SkeletonForm count={2} />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </article>
  );
}
