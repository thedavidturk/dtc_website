"use client";

import dynamic from "next/dynamic";
import Overlay from "@/components/Overlay";

const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#0a0908] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#FF7F6B]/20 border-t-[#FF7F6B] rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#0a0908]">
      <Experience />
      <Overlay />
    </main>
  );
}
