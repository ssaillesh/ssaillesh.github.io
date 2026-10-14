import { ArrowUpRight } from 'lucide-react'
import { education } from '../../data/education'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function EducationSection() {
  return (
    <section id="education" aria-labelledby="education-title" className="section section-end">
      <div className="page-width">
        <Reveal>
          <SectionHeading id="education-title" title="Education" />
        </Reveal>
        <Reveal className="mt-8 grid gap-8 rounded-card bg-surface p-6 md:mt-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12 md:p-10">
          <div>
            <h3 className="text-lead font-semibold text-ink">
              <a
                href={education.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 hover:text-accent"
              >
                {education.school}
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="text-ink-3 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </a>
            </h3>
            <p className="mt-2 text-ink">{education.degree}</p>
            <p className="text-ink-2">{education.specialization}</p>
            <p className="mt-6 text-small text-ink-3">Relevant coursework</p>
            <p className="mt-1 text-ink-2">{education.coursework.join(', ')}</p>
          </div>
          <dl className="grid content-start gap-6">
            <div>
              <dt className="text-small text-ink-3">Graduated</dt>
              <dd className="tabular mt-1 text-ink">{education.graduated}</dd>
            </div>
            <div>
              <dt className="text-small text-ink-3">Awards</dt>
              <dd className="mt-1">
                <ul className="space-y-1 text-ink" role="list">
                  {education.awards.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
