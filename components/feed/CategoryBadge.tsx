type CategoryBadgeProps = {
  category: string;
  className?: string;
};

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-[calc(100%-1rem)] items-center rounded-full border border-white/20 bg-white/90 px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.1em] text-stone-700 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-stone-900/85 dark:text-stone-200 ${className}`}
    >
      <span className="truncate">{category}</span>
    </span>
  );
}
