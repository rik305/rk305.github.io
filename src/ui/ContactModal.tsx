import { useState, type FormEvent } from 'react'
import { site } from '../content/site'
import { ExternalAnchor } from './ExternalAnchor'
import { ModalShell } from './ModalShell'

export function ContactModal() {
  const [notice, setNotice] = useState('')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const honey = data.get('company')
    if (typeof honey === 'string' && honey.trim() !== '') return

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const subject = `Portfolio note from ${name}`
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setNotice(`Opened a message addressed to ${site.email}.`)
    form.reset()
  }

  return (
    <ModalShell title="Contact">
      <p className="mb-3 text-sm">
        Messages are addressed to{' '}
        <ExternalAnchor href={`mailto:${site.email}`} className="underline">
          {site.email}
        </ExternalAnchor>
        .
      </p>
      <div className="mb-4 flex flex-wrap gap-3">
        <ExternalAnchor href={site.links.github} className="underline">
          GitHub
        </ExternalAnchor>
        <ExternalAnchor href={site.links.linkedin} className="underline">
          LinkedIn
        </ExternalAnchor>
        <ExternalAnchor href={site.links.leetcode} className="underline">
          LeetCode
        </ExternalAnchor>
        <ExternalAnchor href={site.phoneHref} className="underline">
          {site.phone}
        </ExternalAnchor>
      </div>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
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
        {notice ? <p className="text-sm text-[#6b442c]">{notice}</p> : null}
      </form>
    </ModalShell>
  )
}
