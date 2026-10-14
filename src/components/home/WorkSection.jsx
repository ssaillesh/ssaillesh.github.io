import { Link, useLocation } from 'react-router'
import { featuredProject, projectRow, textOnlyProjects } from '../../utils/projects'
import { projectPath } from '../../utils/routes'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { FeaturedProject } from './FeaturedProject'
import { ProjectRow } from './ProjectRow'

const lowerFirst = (text) => text.charAt(0).toLowerCase() + text.slice(1)

export function WorkSection() {
  const location = useLocation()

  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <Reveal className="page-width">
        <SectionHeading
          id="work-title"
          title="Work"
          description="Projects across applied AI, full-stack products, and quantitative finance. Open any one for how it was built."
        />
      </Reveal>

      {featuredProject && (
        <div className="mt-10 md:mt-14">
          <FeaturedProject project={featuredProject} />
        </div>
      )}

      {projectRow && (
        <div className="mt-16 md:mt-24">
          <ProjectRow row={projectRow} />
        </div>
      )}

      {textOnlyProjects.length > 0 && (
        <Reveal className="page-width mt-14">
          <p className="max-w-[70ch] text-ink-2">
            Also built:{' '}
            {textOnlyProjects.map((project, index) => (
              <span key={project.slug}>
                {index > 0 && '; '}
                <Link
                  to={projectPath(project.slug)}
                  state={{ backgroundLocation: location, layoutPrefix: null, depth: 1, fromHome: true }}
                  className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent"
                >
                  {project.title}
                </Link>
                , {lowerFirst(project.pitch).replace(/\.$/, '')}
              </span>
            ))}
            .
          </p>
        </Reveal>
      )}
    </section>
  )
}
