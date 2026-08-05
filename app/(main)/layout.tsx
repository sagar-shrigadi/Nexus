import Navbar from "@/app/ui/nav/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 w-full h-svh mx-auto flex-col sm:flex-row sm:items-start sm:justify-center sm:gap-8 md:gap-12 xl:gap-24">
        {children}
      </main>
    </>
  );
}
