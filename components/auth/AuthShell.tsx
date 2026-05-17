import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <section className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 inline-block font-sans text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-50"
        >
          RoomMuse
        </Link>

        <section className="rounded-2xl border border-stone-200/80 bg-white/70 p-6 shadow-[0_8px_40px_rgba(28,25,23,0.06)] backdrop-blur-sm sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/50">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              {subtitle}
            </p>
          </header>

          {children}
        </section>

        <p className="mt-8 text-center text-sm text-stone-500 dark:text-stone-400">
          {footer}
        </p>
      </section>
    </main>
  );
}
