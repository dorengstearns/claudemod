import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AdminDashboard } from './AdminDashboard'
import type { SubscriberRow } from './AdminSubscribers'

export const dynamic = 'force-dynamic'

async function loadAdminData() {
  const admin = createAdminClient()
  const [{ data: pending }, { data: subscribers }] = await Promise.all([
    admin
      .from('mods')
      .select('id, name, description, category, github_url, author_github, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    admin
      .from('newsletter_subscribers')
      .select('id, email, source, status, created_at, unsubscribed_at')
      .order('created_at', { ascending: false })
      .limit(1000),
  ])

  const subscriberList = (subscribers ?? []) as SubscriberRow[]
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const recent7dCount = subscriberList.filter(
    (s) => s.status === 'active' && new Date(s.created_at).getTime() >= sevenDaysAgo
  ).length

  return {
    pending: pending ?? [],
    subscriberList,
    recent7dCount,
  }
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.user_name !== process.env.ADMIN_GITHUB_USERNAME) {
    redirect('/')
  }

  const { pending, subscriberList, recent7dCount } = await loadAdminData()
  const activeCount = subscriberList.filter((s) => s.status === 'active').length

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <span className="text-xs text-muted-foreground">
          {pending.length} pending · {activeCount} active subscribers
        </span>
      </div>
      <AdminDashboard
        mods={pending}
        subscribers={subscriberList}
        recent7dCount={recent7dCount}
      />
    </div>
  )
}
