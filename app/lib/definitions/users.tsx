import { LinkProps } from "next/link";

export interface UserNameCardProps {
  className?: string;
  to: LinkProps["href"];
  username: string;
}
