import type { Metadata } from 'next'
import { UnsubscribeForm } from './UnsubscribeForm'

export const metadata: Metadata = {
  title: 'Unsubscribe from Weekly Digest',
  robots: {
    index: false,
    follow: false,
  },
}

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token } = await searchParams

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Unsubscribe</h1>
      <p className="text-sm text-muted-foreground mb-6">
        ClaudeMod Weekly Digest
      </p>
      <UnsubscribeForm token={token} />
    </div>
  )
}
