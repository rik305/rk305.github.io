import { site } from '../content/site'
import { useStore } from '../store/useStore'
import { AudioDock } from './AudioDock'
import { BrowserModal } from './BrowserModal'
import { ContactModal } from './ContactModal'
import { LinkCard } from './LinkCard'

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
  return null
}
