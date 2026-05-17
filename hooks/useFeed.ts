import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useFeed(selectedTagIds: string[]) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    const fetchFeed = async () => {
      let query = supabase
        .from('room_images')
        .select(`
          *,
          profiles(username, avatar_url),
          room_image_tags(
            tag_id,
            room_style_tags(id, name, category, slug)
          )
        `)
        .order('created_at', { ascending: false })

      // AND filter: image must have ALL selected tags
      if (selectedTagIds.length > 0) {
        // Use a subquery per tag to enforce AND semantics
        for (const tagId of selectedTagIds) {
          query = query.filter(
            'id',
            'in',
            `(select room_image_id from room_image_tags where tag_id = '${tagId}')`
          )
        }
      }

      const { data } = await query
      setImages(data ?? [])
      setLoading(false)
    }

    fetchFeed()
  }, [selectedTagIds.join(',')])

  return { images, loading }
}