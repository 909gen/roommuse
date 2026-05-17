import { supabase } from '@/lib/supabase'

export async function saveImageTags(
  roomImageId: string,
  tagIds: string[],
): Promise<{ ok: true } | { error: string }> {
  if (!tagIds.length) return { ok: true }

  const { error } = await supabase.from('room_image_tags').insert(
    tagIds.map(tag_id => ({ room_image_id: roomImageId, tag_id }))
  )

  if (error) return { error: error.message }
  return { ok: true }
}