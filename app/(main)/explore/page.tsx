import ExploreSidebar from "@/app/ui/sidebar/explore-sidebar";
import ExploreFeed from "@/app/ui/feed/explore-feed";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Explore() {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/login");
  }
  return (
    <>
      <ExploreFeed sessionUser={session.user} />
      <ExploreSidebar sessionUser={session.user} />
    </>
  );
}
