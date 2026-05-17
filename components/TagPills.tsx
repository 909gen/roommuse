import { Tag } from '@/lib/tags'

const CATEGORY_STYLES: Record<string, string> = {
  style: 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
  room:  'bg-teal-50  text-teal-800  dark:bg-teal-950  dark:text-teal-200',
}

export default function TagPills({ tags }: { tags: Tag[] }) {
  if (!tags.length) return null
  return (
    <div className="flex gap-1.5 flex-wrap">
      {tags.map(tag => (
        <span
          key={tag.id}
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[tag.category]}`}
        >
          {tag.name}
        </span>
      ))}
    </div>
  )
}