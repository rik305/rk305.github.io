import { ExternalAnchor } from './ExternalAnchor'
import { ModalShell } from './ModalShell'

type LinkCardProps = {
  title: string
  body: string
  href: string
  action: string
}

export function LinkCard({ title, body, href, action }: LinkCardProps) {
  return (
    <ModalShell title={title}>
      <div className="border-4 border-[#2a1a12] bg-[#1a120c] p-4 text-[#d7f5c8]">
        <p className="font-mono text-sm leading-6">{body}</p>
        <ExternalAnchor
          href={href}
          className="mt-4 inline-block border border-[#7dcea0] px-3 py-2 font-mono text-sm text-[#7dcea0]"
        >
          {action}
        </ExternalAnchor>
      </div>
    </ModalShell>
  )
}
