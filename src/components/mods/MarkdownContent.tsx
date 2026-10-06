'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { resolveImageSrc } from '@/lib/visuals'

interface MarkdownContentProps {
  content: string
  githubUrl?: string
}

// Allow style attribute on common elements for README compatibility + allow video/source tags
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), 'video', 'source'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'style', 'align', 'width', 'height'],
    video: ['src', 'controls', 'autoPlay', 'loop', 'muted', 'poster', 'width', 'height', 'playsInline'],
    source: ['src', 'type'],
  },
}

export function MarkdownContent({ content, githubUrl }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
      components={{
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-3 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-2 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold mt-4 mb-1.5">{children}</h3>,
        p: ({ children }) => <p className="mb-4 text-foreground/90 leading-relaxed">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-foreground/90">{children}</li>,
        code: ({ children, ...props }) => {
          const isBlock = 'node' in props
          return isBlock
            ? <code className="block bg-muted rounded-md px-4 py-3 font-mono text-xs overflow-x-auto">{children}</code>
            : <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">{children}</code>
        },
        pre: ({ children }) => <pre className="mb-4 rounded-lg overflow-hidden">{children}</pre>,
        a: ({ href, children }) => <a href={href ?? '#'} className="text-primary underline underline-offset-4 hover:no-underline" target="_blank" rel="noopener noreferrer">{children}</a>,
        blockquote: ({ children }) => <blockquote className="border-l-4 border-border pl-4 text-muted-foreground italic my-4">{children}</blockquote>,
        hr: () => <hr className="border-border my-6" />,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        img: ({ src, alt }) => {
          const resolved = resolveImageSrc(typeof src === 'string' ? src : '', githubUrl)
          if (!resolved) return null
          return (
            <img
              src={resolved}
              alt={alt ?? ''}
              loading="lazy"
              className="max-w-full h-auto rounded-lg border border-border/40 shadow-xs my-4 max-h-[600px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )
        },
        video: ({ src, ...props }) => (
          <video
            src={typeof src === 'string' ? resolveImageSrc(src, githubUrl) ?? src : undefined}
            controls
            className="max-w-full h-auto rounded-lg border border-border/40 shadow-xs my-4 max-h-[500px]"
            {...props}
          />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
        tr: ({ children }) => <tr className="hover:bg-muted/40 transition-colors">{children}</tr>,
        th: ({ children }) => <th className="text-left font-semibold px-3 py-2 text-foreground">{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 text-foreground/90">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
