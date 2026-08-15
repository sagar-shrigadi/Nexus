import MainSidebar from "@/app/ui/sidebar/main-sidebar";
import MainFeed from "@/app/ui/feed/main-feed";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  return (
    <>
      <MainFeed sessionUser={session.user} />
      <MainSidebar sessionUser={session.user} />
    </>
  );
}
