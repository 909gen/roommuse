"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAuth } from "@/components/auth/AuthProvider";

type SiteHeaderProps = {
  variant?: "default" | "compact";
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const { user, loading } = useAuth();

  return (
    <header
      className={`sticky top-0 z-50 border-b border-stone-200/60 bg-[var(--background)]/85 backdrop-blur-md dark:border-stone-800/60 ${
        variant === "compact" ? "py-3" : "py-4"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="font-sans text-xl font-semibold tracking-tight text-stone-900 transition group-hover:text-stone-600 dark:text-stone-50 dark:group-hover:text-stone-300">
            RoomMuse
          </span>
          {variant === "default" ? (
            <span className="mt-0.5 hidden text-[0.8125rem] font-normal text-stone-500 sm:block dark:text-stone-400">
              Curated interior inspiration
            </span>
          ) : null}
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          {loading ? (
            <span className="px-2 text-sm text-stone-400">…</span>
          ) : user ? (
            <>
              <Link href="/profile" className="rm-btn-ghost hidden sm:inline-flex">
                Profile
              </Link>
              <Link href="/upload" className="rm-btn-primary">
                Upload
              </Link>
              <LogoutButton className="!rounded-full !border-stone-200/80 !bg-white/60 !px-4 !py-2.5 !text-sm !font-medium !text-stone-600 backdrop-blur-sm hover:!bg-white dark:!border-stone-700 dark:!bg-stone-900/40 dark:!text-stone-300 dark:hover:!bg-stone-900" />
            </>
          ) : (
            <>
              <Link href="/login" className="rm-btn-ghost">
                Sign in
              </Link>
              <Link href="/upload" className="rm-btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
