import { site } from '../content/site'
import { useStore } from '../store/useStore'
import { AudioDock } from './AudioDock'
import { BrowserModal } from './BrowserModal'
import { ContactModal } from './ContactModal'
import { ExternalAnchor } from './ExternalAnchor'
import { LinkCard } from './LinkCard'
import { ModalShell } from './ModalShell'

export function Overlays() {
  const modal = useStore((state) => state.modal)
  if (modal === 'computer') return <BrowserModal />
  if (modal === 'tv') {
    return (
      <LinkCard
        title="Letterboxd"
        body="A cathode-ray detour. The screen keeps its scanlines; the list of films lives on Letterboxd."
        href={site.links.letterboxd}
        action="Open Letterboxd"
      />
    )
  }
  if (modal === 'turntable') return <AudioDock />
  if (modal === 'bookshelf') {
    return (
      <LinkCard
        title="Goodreads"
        body="The spines in this room are placeholders. The reading list is on Goodreads."
        href={site.links.goodreads}
        action="Open Goodreads"
      />
    )
  }
  if (modal === 'contact') return <ContactModal />
  if (modal === 'chess') {
    return (
      <ModalShell title="Chess">
        <div className="border-4 border-[#2a1a12] bg-[#1a120c] p-4 text-[#d7f5c8]">
          <p className="font-mono text-sm leading-6">A board in the corner of the room. The games live elsewhere.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <ExternalAnchor
              href={site.links.chess}
              className="border border-[#7dcea0] px-3 py-2 font-mono text-sm text-[#7dcea0]"
            >
              Chess.com
            </ExternalAnchor>
            <ExternalAnchor
              href={site.links.lichess}
              className="border border-[#7dcea0] px-3 py-2 font-mono text-sm text-[#7dcea0]"
            >
              Lichess
            </ExternalAnchor>
          </div>
        </div>
      </ModalShell>
    )
  }
  return null
}
