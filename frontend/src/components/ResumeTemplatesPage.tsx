import { resumeTemplateResources, type ResumeTemplateResource } from '../data/resumeTemplateData'
import { SiteHeader } from './SiteHeader'

function ResumePreview({ resource }: { resource: ResumeTemplateResource }) {
  const isDeveloper = resource.preview === 'developer'

  return (
    <div className={`resume-preview ${isDeveloper ? 'developer-preview' : ''}`} aria-hidden="true">
      <div className="preview-name">ALEX MORGAN</div>
      <div className="preview-contact">B.Tech CSE · Bengaluru · alex@email.com · github.com/alex</div>
      {isDeveloper && <div className="preview-summary">Developer focused on building reliable, useful products.</div>}
      <div className="preview-section">
        <strong>{isDeveloper ? 'EXPERIENCE' : 'EDUCATION'}</strong>
        <span className="preview-rule" />
        <div className="preview-row"><b>{isDeveloper ? 'Software Engineering Intern' : 'B.Tech, Computer Science'}</b><em>2023–Present</em></div>
        <p>{isDeveloper ? 'Built and shipped features used by student teams.' : 'CGPA 8.5 · Relevant coursework and technical activities.'}</p>
      </div>
      <div className="preview-section">
        <strong>{isDeveloper ? 'PROJECTS' : 'EXPERIENCE'}</strong>
        <span className="preview-rule" />
        <div className="preview-row"><b>{isDeveloper ? 'Career guidance dashboard' : 'Engineering Intern'}</b><em>2024</em></div>
        <p>{isDeveloper ? 'Created a private resume analysis tool with React and TypeScript.' : 'Designed, tested, and documented practical engineering work.'}</p>
      </div>
      <div className="preview-section preview-skills">
        <strong>TECHNICAL SKILLS</strong>
        <span className="preview-rule" />
        <p>Python · JavaScript · SQL · Git · Docker</p>
      </div>
    </div>
  )
}

export function ResumeTemplatesPage() {
  return (
    <div className="app-shell templates-shell">
      <SiteHeader activePage="templates" />

      <main id="templates-main" className="templates-main">
        <section className="templates-intro" aria-labelledby="templates-title">
          <p className="eyebrow">Curated resume resources</p>
          <h1 id="templates-title">Start with a resume that is easy to read.</h1>
          <p>
            Carefully selected templates and guidance for engineering students. Use
            the previews to understand the layout, then open the original source
            when you are ready to adapt it.
          </p>
        </section>

        <section className="templates-principles" aria-label="What makes a strong resume">
          <span>Single-column layout</span>
          <span>Relevant evidence first</span>
          <span>Clear technical skills</span>
        </section>

        <section className="template-grid" aria-label="Resume templates and guides">
          {resumeTemplateResources.map((resource) => (
            <article className="template-card" key={resource.id}>
              <ResumePreview resource={resource} />
              <div className="template-content">
                <div className="template-meta">
                  <span>{resource.type}</span>
                  <span>{resource.source}</span>
                </div>
                <h2>{resource.title}</h2>
                <p>{resource.description}</p>
                <p className="template-best-for"><strong>Best for:</strong> {resource.bestFor}</p>
                <ul>
                  {resource.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <div className="template-links">
                  {resource.id === 'jakes-resume' && (
                    <a className="template-link primary-template-link" href="#resume-builder">
                      Build with this template <span aria-hidden="true">→</span>
                    </a>
                  )}
                  <a className="template-link" href={resource.url} target="_blank" rel="noreferrer">
                    Open original {resource.type.toLowerCase()} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="templates-note">
          <strong>More resources are coming.</strong>
          <p>This library is designed to grow. Each future addition will include a source link, a quick suitability note, and a preview of its structure.</p>
        </aside>
      </main>

      <footer>CGC provides learning guidance, not hiring predictions.</footer>
    </div>
  )
}
