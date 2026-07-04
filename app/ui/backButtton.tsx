"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="hover:bg-(--hover) transition-colors rounded-full p-2"
    >
      <ArrowLeft className="size-8 cursor-pointer" />
    </button>
  );
}
