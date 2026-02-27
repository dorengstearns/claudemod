'use client'

import { useActionState } from 'react'
import { useAuth } from '@/components/shared/AuthProvider'
import { GitHubSignIn } from '@/components/shared/GitHubSignIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CATEGORIES } from '@/lib/constants'
import { submitMod, type SubmitFormState } from '@/lib/actions/submit'
import { Send } from 'lucide-react'

const initialState: SubmitFormState = {}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return <p className="text-sm text-destructive mt-1">{errors[0]}</p>
}

export default function SubmitPage() {
  const { user, loading } = useAuth()
  const [state, formAction, isPending] = useActionState(submitMod, initialState)

  if (loading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-3">Submit a Mod</h1>
        <p className="text-muted-foreground mb-6">
          Sign in with GitHub to submit your mod to ClaudeMod.
        </p>
        <GitHubSignIn next="/submit" size="lg" />
      </div>
    )
  }

  const fieldErrors = typeof state.error === 'object' ? state.error : {}
  const globalError = typeof state.error === 'string' ? state.error : null

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Submit a Mod</h1>
        <p className="text-muted-foreground">
          Share your Claude Code skill, MCP server, agent, or other mod with the community.
          Submissions are reviewed before going live.
        </p>
      </div>

      {globalError && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {globalError}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {/* GitHub URL */}
        <div>
          <Label htmlFor="github_url">GitHub Repository URL *</Label>
          <Input
            id="github_url"
            name="github_url"
            placeholder="https://github.com/owner/repo"
            className="mt-1.5"
          />
          <FieldError errors={fieldErrors['github_url']} />
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Mod Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Code Review Skill"
            className="mt-1.5"
          />
          <FieldError errors={fieldErrors['name']} />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select name="category">
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <span className="font-medium">{cat.label}</span>
                  <span className="ml-2 text-muted-foreground text-sm">— {cat.description}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={fieldErrors['category']} />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Short Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Briefly describe what this mod does and who it's for (10–500 characters)"
            className="mt-1.5 resize-none"
            rows={3}
          />
          <FieldError errors={fieldErrors['description']} />
        </div>

        {/* Tags */}
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            placeholder="e.g. typescript, testing, automation (comma-separated)"
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">Up to 10 tags, comma-separated</p>
          <FieldError errors={fieldErrors['tags']} />
        </div>

        <Button type="submit" disabled={isPending} className="w-full gap-2">
          <Send className="h-4 w-4" />
          {isPending ? 'Submitting...' : 'Submit for Review'}
        </Button>
      </form>

      <p className="mt-4 text-xs text-center text-muted-foreground">
        Submissions are manually reviewed. Your mod will appear after approval.
      </p>
    </div>
  )
}
