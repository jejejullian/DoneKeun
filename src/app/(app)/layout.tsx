"use client";

import Navbar from "@/components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-muted">
      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Navbar />

        <main className="flex-1 min-h-0 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
