import { skillGroups } from '../../data/skills'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { TagList } from '../ui/TagList'

export function SkillsSection() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section">
      <div className="page-width">
        <Reveal>
          <SectionHeading
            id="skills-title"
            title="Skills"
            description="Grouped by where I use them. Working familiarity marks tools I have shipped with and am still deepening."
          />
        </Reveal>
        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {skillGroups.map((group, index) => (
            <Reveal key={group.id} delay={Math.min(index * 0.05, 0.2)}>
              <h3 className="font-semibold text-ink">{group.label}</h3>
              <TagList tags={group.items} className="mt-3" />
              {group.familiar && (
                <>
                  <p className="mt-4 text-small text-ink-3">Working familiarity</p>
                  <TagList tags={group.familiar} tone="surface" className="mt-2" />
                </>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
