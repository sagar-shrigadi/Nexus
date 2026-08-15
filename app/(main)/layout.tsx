import Navbar from "@/app/ui/nav/navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  return (
    <>
      <Navbar sessionUser={session.user} />
      <main className="flex flex-1 w-full h-svh mx-auto flex-col sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
        {children}
      </main>
    </>
  );
}
