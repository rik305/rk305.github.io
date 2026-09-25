import { Download } from 'lucide-react'
import { useState } from 'react'
import { site } from '../content/site'
import { ExternalAnchor } from './ExternalAnchor'
import { ModalShell } from './ModalShell'

const tabs = ['Experience', 'Projects', 'Skills', 'Resume'] as const
type Tab = (typeof tabs)[number]

export function BrowserModal() {
  const [tab, setTab] = useState<Tab>('Experience')

  return (
    <ModalShell title="retro://portfolio" wide>
      <div className="border border-[#5c3a28] bg-[#2a1a12] p-2 text-[#f6efe4]">
        <div className="mb-2 flex gap-1 overflow-x-auto" role="tablist" aria-label="Portfolio pages">
          {tabs.map((name) => {
            const selected = tab === name
            return (
              <button
                key={name}
                type="button"
                role="tab"
                id={`tab-${name}`}
                aria-selected={selected}
                aria-controls={`panel-${name}`}
                className={`px-3 py-1 text-sm ${selected ? 'bg-[#f3e6d0] text-[#3a2418]' : 'bg-[#4a3024] text-[#f6efe4]'}`}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            )
          })}
        </div>
        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="min-h-52 bg-[#f7f1e4] p-4 text-[#3a2418]"
        >
          {tab === 'Experience' ? (
            <ul className="space-y-5">
              {site.experience.map((item) => (
                <li key={item.org}>
                  <h3 className="text-xl">{item.role}</h3>
                  <p className="text-sm tracking-wide text-[#8c3a32]">
                    {item.org} · {item.where}
                  </p>
                  <p className="text-sm text-[#6b442c]">{item.when}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : null}
          {tab === 'Projects' ? (
            <ul className="space-y-5">
              {site.projects.map((project) => (
                <li key={project.name}>
                  <h3 className="text-xl">{project.name}</h3>
                  <p className="text-sm text-[#6b442c]">
                    {project.when} · {project.stack}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ExternalAnchor href={project.href} className="mt-2 inline-block underline">
                    View code
                  </ExternalAnchor>
                </li>
              ))}
            </ul>
          ) : null}
          {tab === 'Skills' ? (
            <ul className="flex flex-wrap gap-2">
              {site.skills.map((skill) => (
                <li key={skill} className="border border-[#5c3a28] bg-[#ead7b5] px-3 py-2">
                  {skill}
                </li>
              ))}
            </ul>
          ) : null}
          {tab === 'Resume' ? (
            <div className="border border-[#d8c09a] bg-[#fffaf2] p-4">
              <h3 className="text-2xl">{site.name}</h3>
              <p className="mt-1 text-[#6b442c]">{site.education.program}</p>
              <p className="text-sm">
                {site.education.school} · {site.education.when} · GPA {site.education.gpa}
              </p>
              <p className="mt-3 flex flex-wrap gap-3 text-sm">
                <ExternalAnchor href={`mailto:${site.email}`} className="underline">
                  {site.email}
                </ExternalAnchor>
                <ExternalAnchor href={site.phoneHref} className="underline">
                  {site.phone}
                </ExternalAnchor>
                <ExternalAnchor href={site.links.linkedin} className="underline">
                  LinkedIn
                </ExternalAnchor>
                <ExternalAnchor href={site.links.github} className="underline">
                  GitHub
                </ExternalAnchor>
                <ExternalAnchor href={site.links.leetcode} className="underline">
                  LeetCode
                </ExternalAnchor>
              </p>
              <a
                href={site.resumeHref}
                download
                className="mt-4 inline-flex items-center gap-2 bg-[#c4522a] px-4 py-2 text-[#fffaf2]"
              >
                <Download size={16} />
                Download PDF
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </ModalShell>
  )
}
