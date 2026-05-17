"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { saveRoomImage, uploadRoomImageFile, validateImageFile } from "@/lib/room-images";
import { useTags } from "@/hooks/useTags";
import type { Tag } from "@/types/tag";

export function UploadForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const { styleTags, roomTags } = useTags();

  const toggleTag = (id: string) =>
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  function handleFileChange(selected: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!selected) {
      setFile(null);
      setPreviewUrl(null);
      setError(null);
      return;
    }

    const validationError = validateImageFile(selected);
    if (validationError) {
      setFile(null);
      setPreviewUrl(null);
      setError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setError(null);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!user) { setError("You must be signed in to upload."); return; }
    if (!file) { setError("Please choose an image to upload."); return; }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) { setError("Please enter a title."); return; }

    setSubmitting(true);

    const uploadResult = await uploadRoomImageFile(file);
    if ("error" in uploadResult) {
      setSubmitting(false);
      setError(uploadResult.error);
      return;
    }

    const saveResult = await saveRoomImage({
      title: trimmedTitle,
      image_url: uploadResult.imageUrl,
      category: "uncategorized",
    });

    if ("error" in saveResult) {
      setSubmitting(false);
      setError(saveResult.error);
      return;
    }

    await saveImageTags(saveResult.data.id, selectedTagIds);

    setSubmitting(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-stone-500 dark:text-stone-400">Checking your session…</p>;
  }

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-3">
        <span className="rm-label">Photo</span>
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
          className="sr-only"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
        <label
          htmlFor={fileInputId}
          className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed transition ${
            previewUrl
              ? "border-stone-300 bg-stone-100/50 p-0 dark:border-stone-600 dark:bg-stone-900/50"
              : "border-stone-300/90 bg-white/50 p-8 hover:border-stone-400 hover:bg-white dark:border-stone-600 dark:bg-stone-900/30 dark:hover:border-stone-500 dark:hover:bg-stone-900/50"
          }`}
        >
          {previewUrl ? (
            <figure className="relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="max-h-[360px] w-full object-contain" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/60 to-transparent px-4 py-3 text-center text-xs font-medium text-white">
                Tap to change image
              </span>
            </figure>
          ) : (
            <>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900/5 text-2xl text-stone-600 dark:bg-white/10 dark:text-stone-300">
                +
              </span>
              <span className="mt-4 text-sm font-medium text-stone-800 dark:text-stone-200">
                Choose an image
              </span>
              <span className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                JPEG, PNG, WebP or GIF · up to 10 MB
              </span>
            </>
          )}
        </label>
      </section>

      <section className="space-y-3">
        <span className="rm-label">Title</span>
        <input
          type="text"
          name="title"
          required
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rm-input"
          placeholder="Sunlit minimal living room"
        />
      </section>

      <section className="space-y-5">
        <span className="rm-label">Tags</span>
        {[
          { label: "Style", tags: styleTags },
          { label: "Room",  tags: roomTags  },
        ].map(({ label, tags }) => (
          <div key={label} className="space-y-2">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-stone-400 dark:text-stone-500">
              {label}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: Tag) => {
                const active = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? "bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100"
                        : "text-stone-500 border-stone-200 hover:border-stone-400 dark:border-stone-700 dark:text-stone-400 dark:hover:border-stone-500"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-stone-200/80 pt-6 sm:flex-row sm:items-center sm:justify-end dark:border-stone-800">
        <Link href="/" className="rm-btn-ghost text-center">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting || !file}
          className="rm-btn-primary min-w-[10rem]"
        >
          {submitting ? "Publishing…" : "Publish"}
        </button>
      </div>
    </form>
  );
}