"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomeFeed } from "@/components/feed/HomeFeed";
import { useAuth } from "@/components/auth/AuthProvider";

export function HomeContent() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1440px] px-3 pb-20 pt-4 sm:px-5 sm:pt-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,113,108,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(120,113,108,0.08),transparent)]"
          aria-hidden="true"
        />

        <header className="mb-8 text-center sm:mb-10 sm:text-left">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
            RoomMuse
          </p>
          <h1 className="mt-3 font-sans text-[1.75rem] font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
            Interior inspiration,
            <span className="block text-stone-500 dark:text-stone-400">
              curated for you
            </span>
          </h1>
          {!loading && !user ? (
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-500 sm:mx-0 dark:text-stone-400">
              Discover rooms from the community.{" "}
              <Link
                href="/login"
                className="font-medium text-stone-800 underline-offset-4 transition-colors hover:text-stone-600 hover:underline dark:text-stone-200 dark:hover:text-stone-100"
              >
                Sign in
              </Link>{" "}
              to save and share your own spaces.
            </p>
          ) : (
            <p className="mx-auto mt-4 max-w-md text-sm text-stone-500 sm:mx-0 dark:text-stone-400">
              Scroll the feed — save what inspires you.
            </p>
          )}
        </header>

        <HomeFeed />
      </main>
    </div>
  );
}
