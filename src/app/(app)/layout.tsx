import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session){
    redirect('/login')
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0">
        <Navbar name={session.user.name} email={session.user.email} />

        <main className="flex-1 min-h-0 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
