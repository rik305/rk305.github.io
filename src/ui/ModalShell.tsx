import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useStore } from '../store/useStore'

const FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'

type ModalShellProps = {
  title: string
  children: ReactNode
  wide?: boolean
}

export function ModalShell({ title, children, wide = false }: ModalShellProps) {
  const close = useStore((state) => state.close)
  const panel = useRef<HTMLDivElement>(null)
  const titleId = 'dialog-title'

  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = panel.current
    const items = root ? [...root.querySelectorAll<HTMLElement>(FOCUSABLE)] : []
    items[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab' || !root) return
      const current = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (element) => !element.hasAttribute('disabled'),
      )
      if (current.length === 0) return
      const first = current[0]
      const last = current[current.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [close])

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        className="absolute inset-0 bg-[#1c1410]/70"
        onClick={close}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative z-10 max-h-[85vh] w-full overflow-auto border-2 border-[#5c3a28] bg-[#f3e6d0] text-[#3a2418] shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-md'}`}
      >
        <div className="flex items-center justify-between border-b border-[#d8c09a] bg-[#ead7b5] px-4 py-3">
          <h2 id={titleId} className="text-lg">
            {title}
          </h2>
          <button
            type="button"
            onClick={close}
            className="rounded p-1 hover:bg-[#f3e6d0]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
