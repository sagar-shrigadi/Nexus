import Link, { LinkProps } from "next/link";

interface NavlinkProps {
  to: LinkProps["href"];
  children: React.ReactNode;
}
export default function Navlink({ to, children }: NavlinkProps) {
  return (
    <Link href={to} className="flex items-center gap-4 cursor-pointer py-2">
      {children}
    </Link>
  );
}
