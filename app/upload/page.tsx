import { SiteHeader } from "@/components/layout/SiteHeader";
import { UploadForm } from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader variant="compact" />

      <main className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 text-center sm:text-left">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
            Share
          </p>
          <h1 className="mt-2 font-sans text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
            Add to the collection
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Upload a room photo with a title and category. It will appear in the
            community feed.
          </p>
        </header>

        <section className="rounded-2xl border border-stone-200/80 bg-white/70 p-6 shadow-[0_8px_40px_rgba(28,25,23,0.06)] backdrop-blur-sm sm:p-8 dark:border-stone-800/80 dark:bg-stone-900/50 dark:shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
          <UploadForm />
        </section>
      </main>
    </div>
  );
}
