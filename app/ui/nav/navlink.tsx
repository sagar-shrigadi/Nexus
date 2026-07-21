import Link, { LinkProps } from "next/link";

interface NavlinkProps {
  to: LinkProps["href"];
  children: React.ReactNode;
}
export default function Navlink({ to, children }: NavlinkProps) {
  return (
    <Link
      href={to}
      className="flex items-center gap-4 cursor-pointer px-2 sm:px-4 py-2"
    >
      {children}
    </Link>
  );
}
