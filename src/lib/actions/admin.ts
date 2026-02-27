'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

const ADMIN_USERNAME = process.env.ADMIN_GITHUB_USERNAME

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.user_name !== ADMIN_USERNAME) {
    throw new Error('Unauthorized')
  }
}

export async function approveMod(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('mods').update({ status: 'approved' }).eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/browse')
}

export async function rejectMod(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('mods').update({ status: 'rejected' }).eq('id', id)
  revalidatePath('/admin')
}
