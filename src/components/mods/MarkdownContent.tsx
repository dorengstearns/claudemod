'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
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
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
