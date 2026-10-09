"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { toast } from "./ui/toast";
import { Spinner } from "./ui/spinner";
import Image from "next/image";

import logo from "@/assets/images/logo.webp";

interface NavbarProps {
  name?: string | null;
  email?: string | null;
}

function getInitials(name?: string | null) {
  return name?.trim().slice(0, 2).toUpperCase() || "DK";
}

export default function Navbar({ name, email }: NavbarProps) {
  const router = useRouter();
  const initials = getInitials(name);
  const { resolvedTheme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              type: "success",
              title: "Logged out successfully.",
            });
            router.push("/login");
            router.refresh();
          },
          onError: (ctx) => {
            toast.add({
              type: "error",
              title: ctx.error.message || "You failed to log out. Please try again.",
            });
            setLoading(false);
          },
        },
      });
    } catch (err) {
      console.error("Logout failed", err);
      setLoading(false);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 gap-2 shrink-0 border-b border-border">
      <div className="flex items-center gap-2">
        <Image src={logo} width={512} height={512} alt="Job Tracker" className="h-8 md:h-10 w-auto" />
        <span className="text-xl md:text-2xl font-bold select-none font-brand">DoneKeun</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setAnimate(true);
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
          }}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <Sun size={22} className={`dark:hidden ${animate ? "animate-icon-in" : ""}`} />
          <Moon size={22} className={`hidden dark:block ${animate ? "animate-icon-in" : ""}`} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger aria-label="profile menu" className="w-8 h-8 rounded-full  border border-border hover:border-primary flex items-center justify-center text-xs font-medium cursor-pointer">
            {initials}
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48 p-0 overflow-hidden rounded-xl">
            <div className="px-3 py-3 border-b border-border">
              <p className="text-sm font-medium truncate text-foreground">{name}</p>
              <p className="text-xs truncate text-muted-foreground">{email}</p>
            </div>

            <DropdownMenuItem onClick={handleLogout} disabled={loading} variant="destructive" className="gap-3 px-3 py-3 rounded-none cursor-pointer">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Signing out...</span>
                </div>
              ) : (
                <>
                  <LogOut aria-hidden="true" size={15} />
                  <span>Sign out</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
