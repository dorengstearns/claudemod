import type { Metadata } from 'next'
import { OptInClient } from './OptInClient'

export const metadata: Metadata = {
  title: 'Weekly Digest Opt-In',
  robots: {
    index: false,
    follow: false,
  },
}

interface OptInPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function NewsletterOptInPage({ searchParams }: OptInPageProps) {
  const { token } = await searchParams

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
          ClaudeMod Weekly Digest
        </p>
        <h1 className="text-2xl font-bold tracking-tight">One-Click Opt-In</h1>
      </div>
      <OptInClient token={token} />
    </div>
  )
}
