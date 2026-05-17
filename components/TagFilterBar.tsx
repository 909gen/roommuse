import type { Tag } from '@/hooks/useTags'

type Props = {
  styleTags: Tag[]
  roomTags: Tag[]
  selected: string[]          // array of tag ids
  onChange: (ids: string[]) => void
}

export default function TagFilterBar({ styleTags, roomTags, selected, onChange }: Props) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])

  const clearAll = () => onChange([])

  return (
    <div className="flex flex-col gap-3 mb-6">
      {[
        { label: 'Style', tags: styleTags },
        { label: 'Room',  tags: roomTags  },
      ].map(({ label, tags }) => (
        <div key={label} className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider w-10 shrink-0">
            {label}
          </span>
          {tags.map(tag => {
            const active = selected.includes(tag.id)
            return (
              <button
                key={tag.id}
                onClick={() => toggle(tag.id)}
                className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white'
                    : 'text-neutral-500 border-neutral-200 hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-500'
                }`}
              >
                {tag.name}
              </button>
            )
          })}
          {label === 'Style' && selected.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-neutral-400 hover:text-neutral-600 ml-1 underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
