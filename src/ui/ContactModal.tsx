import { useState, type FormEvent } from 'react'
import { site } from '../content/site'
import { ExternalAnchor } from './ExternalAnchor'
import { ModalShell } from './ModalShell'

export function ContactModal() {
  const [notice, setNotice] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const honey = new FormData(event.currentTarget).get('company')
    if (typeof honey === 'string' && honey.trim() !== '') {
      event.preventDefault()
      return
    }
    if (!site.formEndpoint) {
      event.preventDefault()
      setNotice('Add VITE_FORM_ENDPOINT to connect this form to Formspree or Web3Forms.')
    }
  }

  return (
    <ModalShell title="Contact">
      <div className="mb-4 flex gap-3">
        <ExternalAnchor href={site.links.github} className="underline">
          GitHub
        </ExternalAnchor>
        <ExternalAnchor href={site.links.linkedin} className="underline">
          LinkedIn
        </ExternalAnchor>
      </div>
      <form action={site.formEndpoint || undefined} method="POST" className="space-y-3" onSubmit={onSubmit}>
        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <label className="block text-sm">
          Name
          <input name="name" required autoComplete="name" className="mt-1 w-full border border-[#5c3a28] bg-white px-2 py-2" />
        </label>
        <label className="block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full border border-[#5c3a28] bg-white px-2 py-2"
          />
        </label>
        <label className="block text-sm">
          Message
          <textarea name="message" required rows={4} className="mt-1 w-full border border-[#5c3a28] bg-white px-2 py-2" />
        </label>
        <button type="submit" className="bg-[#c4522a] px-4 py-2 text-[#fffaf2]">
          Send
        </button>
        {notice ? <p className="text-sm text-[#8c3a32]">{notice}</p> : null}
        {site.formEndpoint ? null : (
          <p className="text-sm text-[#6b442c]">Form endpoint is not configured yet.</p>
        )}
      </form>
    </ModalShell>
  )
}
