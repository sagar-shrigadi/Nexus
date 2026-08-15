"use client";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface NavlinkProps {
  to: LinkProps["href"];
  children: React.ReactNode;
}
export default function Navlink({ to, children }: NavlinkProps) {
  const pathname = usePathname();
  return (
    <li className="flex items-center justify-center">
      <Link
        href={to}
        aria-label={to === "/" ? "Home" : "Explore"}
        className={`grow flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-sidebar-accent rounded transition-colors ${pathname === to ? "bg-sidebar-accent" : ""}`}
      >
        {children}
      </Link>
    </li>
  );
}
