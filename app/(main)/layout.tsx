import Navbar from "@/app/ui/nav/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}
