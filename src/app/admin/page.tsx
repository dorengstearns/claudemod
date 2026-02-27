import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminQueue } from './AdminQueue'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.user_name !== process.env.ADMIN_GITHUB_USERNAME) {
    redirect('/')
  }

  const admin = createAdminClient()
  const { data: pending } = await admin
    .from('mods')
    .select('id, name, description, category, github_url, author_github, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mod Queue</h1>
        <span className="text-sm text-muted-foreground">{pending?.length ?? 0} pending</span>
      </div>
      <AdminQueue mods={pending ?? []} />
    </div>
  )
}
