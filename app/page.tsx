"use client";

import dynamic from "next/dynamic";
import Overlay from "@/components/Overlay";

// Lazy load the 3D experience to prevent SSR issues
const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#351E28] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#FF5C34]/20 border-t-[#FF5C34] rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#351E28] overflow-hidden">
      <Experience />
      <Overlay />
    </main>
  );
}
