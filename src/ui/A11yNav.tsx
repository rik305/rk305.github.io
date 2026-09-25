import { site } from '../content/site'
import { useStore, type ModalId } from '../store/useStore'

const actions: { id: ModalId; label: string }[] = [
  { id: 'computer', label: 'Open computer' },
  { id: 'tv', label: 'Open television' },
  { id: 'turntable', label: 'Open turntable' },
  { id: 'bookshelf', label: 'Open bookshelf' },
  { id: 'contact', label: 'Open contact board' },
]

const focusClass =
  'sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:w-auto focus:h-auto focus:overflow-visible focus:bg-[#f3e6d0] focus:px-3 focus:py-2 focus:text-sm focus:text-[#3a2418]'

export function A11yNav() {
  const open = useStore((state) => state.open)
  return (
    <nav aria-label="Room interactions">
      <p className={focusClass}>
        {site.name}. {site.role}.
      </p>
      {actions.map((action) => (
        <button key={action.id} type="button" className={focusClass} onClick={() => open(action.id)}>
          {action.label}
        </button>
      ))}
    </nav>
  )
}
