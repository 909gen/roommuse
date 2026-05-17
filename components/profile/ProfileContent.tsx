"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { FeedCard } from "@/components/feed/FeedCard";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ensureCurrentUserProfile, fetchUserProfile } from "@/lib/profile";
import type { UserProfile } from "@/types/profile";

type ProfileContentProps = {
  userId?: string;
};

export function ProfileContent({ userId }: ProfileContentProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId ?? user?.id ?? null;
  const isOwnProfile = Boolean(user && targetUserId && user.id === targetUserId);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!userId && !user) {
      router.replace("/login");
      return;
    }

    if (!targetUserId) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      if (isOwnProfile) {
        await ensureCurrentUserProfile();
      }

      if (!targetUserId) {
  setLoading(false);
  return;
}

const result = await fetchUserProfile(targetUserId);

      if (cancelled) {
        return;
      }

      if ("error" in result) {
        setError(result.error);
        setProfile(null);
      } else {
        setProfile(result.data);
      }

      setLoading(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, userId, targetUserId, isOwnProfile, router]);

  return (
    <div className="min-h-screen">
      <SiteHeader variant="compact" />

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {loading ? (
          <ProfileSkeleton />
        ) : error ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200/80 bg-red-50/80 px-5 py-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
          >
            {error}
          </p>
        ) : profile ? (
          <>
            <header className="mb-10 flex flex-col gap-6 border-b border-stone-200/80 pb-10 sm:flex-row sm:items-end sm:justify-between dark:border-stone-800">
              <div>
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                  Profile
                </p>
                <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
                  @{profile.username}
                </h1>
                {isOwnProfile ? (
                  <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                    Your public collection on RoomMuse
                  </p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <StatCard label="Uploads" value={profile.total_uploads} />
                <StatCard label="Total likes" value={profile.total_likes} />
              </div>
            </header>

            {profile.uploads.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300/80 bg-white/50 px-6 py-16 text-center dark:border-stone-700 dark:bg-stone-900/30">
                <p className="text-lg font-medium tracking-tight text-stone-800 dark:text-stone-100">
                  No uploads yet
                </p>
                {isOwnProfile ? (
                  <>
                    <p className="mt-2 max-w-sm text-sm text-stone-500 dark:text-stone-400">
                      Share your first room to build your profile.
                    </p>
                    <Link href="/upload" className="rm-btn-primary mt-6">
                      Upload a room
                    </Link>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                    This user has not published any rooms yet.
                  </p>
                )}
              </div>
            ) : (
              <section aria-label="Uploaded rooms">
                <h2 className="sr-only">Uploaded images</h2>
                <div className="rm-masonry columns-2 sm:columns-3 lg:columns-4 xl:columns-5">
                  {profile.uploads.map((post) => (
                    <FeedCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[7.5rem] rounded-2xl border border-stone-200/80 bg-white/70 px-5 py-4 text-center shadow-sm dark:border-stone-800/80 dark:bg-stone-900/50">
      <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
        {value}
      </p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="space-y-3 border-b border-stone-200/80 pb-10 dark:border-stone-800">
        <div className="h-3 w-16 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-10 w-48 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="grid grid-cols-2 gap-3 sm:w-80">
          <div className="h-20 rounded-2xl bg-stone-200 dark:bg-stone-800" />
          <div className="h-20 rounded-2xl bg-stone-200 dark:bg-stone-800" />
        </div>
      </div>
      <div className="rm-masonry columns-2 sm:columns-3 lg:columns-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="mb-5 h-56 break-inside-avoid rounded-2xl bg-stone-200 dark:bg-stone-800"
          />
        ))}
      </div>
    </div>
  );
}
