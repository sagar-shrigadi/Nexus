import Navbar from "@/app/ui/nav/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex flex-1 w-full h-dvh mx-auto flex-col px-2 sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
        {children}
      </main>
      <Navbar />
    </>
  );
}
