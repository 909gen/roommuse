import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Tag = {
  id: string
  name: string
  category: 'style' | 'room'
  slug: string
  sort_order: number
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    supabase
      .from('room_style_tags')
      .select('*')
      .order('sort_order')
      .then(({ data }) => { if (data) setTags(data) })
  }, [])

  const styleTags = tags.filter(t => t.category === 'style')
  const roomTags  = tags.filter(t => t.category === 'room')

  return { tags, styleTags, roomTags }
}