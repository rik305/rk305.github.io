import type { ReactNode } from 'react'

type ExternalAnchorProps = {
  href: string
  className?: string
  children: ReactNode
}

export function ExternalAnchor({ href, className, children }: ExternalAnchorProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
