import { useState, type ReactNode } from 'react'
import {
  createCustomSection,
  createEducation,
  createExperience,
  createProject,
  createResumeDraft,
  createSkillGroup,
} from '../resumeBuilder/createDraft'
import { downloadResumePdf, generateResumePdf } from '../resumeBuilder/generatePdf'
import type {
  CustomSection,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeDraft,
  SkillGroup,
} from '../resumeBuilder/types'
import { getResumeLengthWarning, resumeLimits, validateResumeDraft } from '../resumeBuilder/validation'

function hasText(value: string) {
  return value.trim().length > 0
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.length) return items
  const next = [...items]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label className="builder-field">
      <span>{label}{required && <em>Required</em>}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </label>
  )
}

function EntryActions({
  label,
  index,
  count,
  onMove,
  onRemove,
}: {
  label: string
  index: number
  count: number
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}) {
  return (
    <div className="entry-actions" aria-label={`${label} controls`}>
      <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label={`Move ${label} up`}>↑</button>
      <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label={`Move ${label} down`}>↓</button>
      <button className="remove-entry" type="button" onClick={onRemove}>Remove</button>
    </div>
  )
}

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (bullets: string[]) => void }) {
  function updateBullet(index: number, value: string) {
    onChange(bullets.map((bullet, bulletIndex) => bulletIndex === index ? value : bullet))
  }

  return (
    <div className="bullet-editor">
      <div className="bullet-heading">
        <span>Bullet points</span>
        <small>Start with an action and add a result when you can.</small>
      </div>
      {bullets.map((bullet, index) => (
        <div className="bullet-row" key={index}>
          <span aria-hidden="true">•</span>
          <textarea
            value={bullet}
            onChange={(event) => updateBullet(index, event.target.value)}
            placeholder="Built a React dashboard that reduced manual reporting time by 30%."
            aria-label={`Bullet point ${index + 1}`}
            rows={2}
          />
          <button
            type="button"
            onClick={() => onChange(bullets.filter((_, bulletIndex) => bulletIndex !== index))}
            disabled={bullets.length === 1}
            aria-label={`Remove bullet point ${index + 1}`}
          >×</button>
        </div>
      ))}
      <button className="text-button" type="button" onClick={() => onChange([...bullets, ''])} disabled={bullets.length >= resumeLimits.bulletsPerEntry}>+ Add bullet</button>
    </div>
  )
}

function BuilderSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="builder-section">
      <div className="builder-section-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  )
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="paper-section"><h3>{title}</h3>{children}</section>
}

function ResumePreview({ draft }: { draft: ResumeDraft }) {
  const contactItems = [draft.contact.phone, draft.contact.email, draft.contact.linkedin, draft.contact.github, draft.contact.portfolio].filter(hasText)
  const education = draft.education.filter((entry) => Object.values(entry).some((value) => value !== entry.id && hasText(value)))
  const experience = draft.experience.filter((entry) => hasText(entry.role) || hasText(entry.organisation))
  const projects = draft.projects.filter((entry) => hasText(entry.name))
  const skills = draft.skills.filter((group) => hasText(group.label) && hasText(group.skills))
  const customSections = draft.customSections.filter((section) => hasText(section.title) && section.bullets.some(hasText))

  return (
    <article className="builder-paper" aria-label="Live resume preview">
      <header className="paper-header">
        <h2>{draft.contact.fullName || 'Your Name'}</h2>
        <p>{contactItems.length ? contactItems.join('  |  ') : 'Phone  |  Email  |  LinkedIn  |  GitHub'}</p>
      </header>

      {education.length > 0 && <PreviewSection title="Education">{education.map((entry) => (
        <div className="paper-entry" key={entry.id}>
          <div><strong>{entry.school || 'School or university'}</strong><span>{entry.location}</span></div>
          <div><em>{entry.qualification}</em><em>{entry.dates}</em></div>
        </div>
      ))}</PreviewSection>}

      {experience.length > 0 && <PreviewSection title="Experience">{experience.map((entry) => (
        <div className="paper-entry" key={entry.id}>
          <div><strong>{entry.role || 'Role'}</strong><span>{entry.dates}</span></div>
          <div><em>{entry.organisation}</em><em>{entry.location}</em></div>
          <ul>{entry.bullets.filter(hasText).map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
        </div>
      ))}</PreviewSection>}

      {projects.length > 0 && <PreviewSection title="Projects">{projects.map((entry) => (
        <div className="paper-entry" key={entry.id}>
          <div><strong>{entry.name}{hasText(entry.technologies) && <small> | {entry.technologies}</small>}</strong><span>{entry.dates}</span></div>
          <ul>{entry.bullets.filter(hasText).map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
        </div>
      ))}</PreviewSection>}

      {skills.length > 0 && <PreviewSection title="Technical Skills"><div className="paper-skills">{skills.map((group) => (
        <p key={group.id}><strong>{group.label}:</strong> {group.skills}</p>
      ))}</div></PreviewSection>}

      {customSections.map((section) => <PreviewSection title={section.title} key={section.id}>
        <ul className="paper-custom-list">{section.bullets.filter(hasText).map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
      </PreviewSection>)}

      {!hasText(draft.contact.fullName) && education.length === 0 && experience.length === 0 && projects.length === 0 && skills.length === 0 && (
        <p className="paper-empty">Your resume will take shape here as you complete the form.</p>
      )}
    </article>
  )
}

export function ResumeBuilderPage() {
  const [draft, setDraft] = useState(createResumeDraft)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const lengthWarning = getResumeLengthWarning(draft)

  function updateList<K extends 'education' | 'experience' | 'projects' | 'skills' | 'customSections'>(key: K, value: ResumeDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function updateEntry<K extends 'education' | 'experience' | 'projects' | 'skills' | 'customSections'>(key: K, index: number, value: ResumeDraft[K][number]) {
    updateList(key, draft[key].map((entry, entryIndex) => entryIndex === index ? value : entry) as ResumeDraft[K])
  }

  async function handleDownload() {
    const errors = validateResumeDraft(draft)
    if (errors.length) {
      setGenerationError(errors[0])
      return
    }
    setGenerationError('')
    setIsGenerating(true)
    try {
      const pdf = await generateResumePdf(draft)
      downloadResumePdf(pdf, draft.contact.fullName)
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Your PDF could not be generated. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app-shell builder-shell">
      <header className="site-header builder-header">
        <a className="brand" href="#main" aria-label="CGC Resume Check home">
          <span className="brand-mark" aria-hidden="true">CG</span>
          <span>Career Guidance Club</span>
        </a>
        <a className="templates-nav-link" href="#templates">Resume templates</a>
      </header>

      <main className="builder-main">
        <section className="builder-intro">
          <div>
            <p className="eyebrow">Jake's Resume builder</p>
            <h1>Build a resume that is clear, focused, and ready to share.</h1>
            <p>Complete the fields in your own words. Your draft stays in this tab and the preview follows Jake's proven single-column structure.</p>
          </div>
          <div className="builder-privacy-note"><strong>Private draft</strong><span>Nothing is saved or sent anywhere. Your PDF is created directly in this browser.</span></div>
        </section>

        <div className="builder-workspace">
          <form className="builder-form" onSubmit={(event) => event.preventDefault()}>
            <BuilderSection title="Contact" description="Make it easy for someone to reach you and review your work.">
              <div className="builder-fields two-columns">
                <Field label="Full name" value={draft.contact.fullName} onChange={(fullName) => setDraft({ ...draft, contact: { ...draft.contact, fullName } })} placeholder="Jake Ryan" required />
                <Field label="Phone" value={draft.contact.phone} onChange={(phone) => setDraft({ ...draft, contact: { ...draft.contact, phone } })} placeholder="+91 98765 43210" type="tel" />
                <Field label="Email" value={draft.contact.email} onChange={(email) => setDraft({ ...draft, contact: { ...draft.contact, email } })} placeholder="you@example.com" type="email" required />
                <Field label="LinkedIn" value={draft.contact.linkedin} onChange={(linkedin) => setDraft({ ...draft, contact: { ...draft.contact, linkedin } })} placeholder="linkedin.com/in/you" />
                <Field label="GitHub" value={draft.contact.github} onChange={(github) => setDraft({ ...draft, contact: { ...draft.contact, github } })} placeholder="github.com/you" />
                <Field label="Portfolio" value={draft.contact.portfolio} onChange={(portfolio) => setDraft({ ...draft, contact: { ...draft.contact, portfolio } })} placeholder="yourportfolio.com" />
              </div>
            </BuilderSection>

            <BuilderSection title="Education" description="List your most recent qualification first.">
              {draft.education.map((entry: EducationEntry, index) => <div className="builder-entry" key={entry.id}>
                <EntryActions label={`education entry ${index + 1}`} index={index} count={draft.education.length} onMove={(direction) => updateList('education', moveItem(draft.education, index, direction))} onRemove={() => updateList('education', draft.education.filter((_, itemIndex) => itemIndex !== index))} />
                <div className="builder-fields two-columns">
                  <Field label="School or university" value={entry.school} onChange={(school) => updateEntry('education', index, { ...entry, school })} placeholder="Southwestern University" />
                  <Field label="Location" value={entry.location} onChange={(location) => updateEntry('education', index, { ...entry, location })} placeholder="Georgetown, TX" />
                  <Field label="Degree and subject" value={entry.qualification} onChange={(qualification) => updateEntry('education', index, { ...entry, qualification })} placeholder="B.Tech in Computer Science" />
                  <Field label="Dates" value={entry.dates} onChange={(dates) => updateEntry('education', index, { ...entry, dates })} placeholder="Aug. 2022 - May 2026" />
                </div>
              </div>)}
              <button className="add-entry-button" type="button" onClick={() => updateList('education', [...draft.education, createEducation()])} disabled={draft.education.length >= resumeLimits.education}>+ Add education</button>
            </BuilderSection>

            <BuilderSection title="Experience" description="Use evidence: what you did, how you did it, and what changed.">
              {draft.experience.map((entry: ExperienceEntry, index) => <div className="builder-entry" key={entry.id}>
                <EntryActions label={`experience entry ${index + 1}`} index={index} count={draft.experience.length} onMove={(direction) => updateList('experience', moveItem(draft.experience, index, direction))} onRemove={() => updateList('experience', draft.experience.filter((_, itemIndex) => itemIndex !== index))} />
                <div className="builder-fields two-columns">
                  <Field label="Role" value={entry.role} onChange={(role) => updateEntry('experience', index, { ...entry, role })} placeholder="Software Engineering Intern" />
                  <Field label="Dates" value={entry.dates} onChange={(dates) => updateEntry('experience', index, { ...entry, dates })} placeholder="May 2025 - July 2025" />
                  <Field label="Organisation" value={entry.organisation} onChange={(organisation) => updateEntry('experience', index, { ...entry, organisation })} placeholder="Organisation name" />
                  <Field label="Location" value={entry.location} onChange={(location) => updateEntry('experience', index, { ...entry, location })} placeholder="Bengaluru, India" />
                </div>
                <BulletEditor bullets={entry.bullets} onChange={(bullets) => updateEntry('experience', index, { ...entry, bullets })} />
              </div>)}
              <button className="add-entry-button" type="button" onClick={() => updateList('experience', [...draft.experience, createExperience()])} disabled={draft.experience.length >= resumeLimits.experience}>+ Add experience</button>
            </BuilderSection>

            <BuilderSection title="Projects" description="Choose projects that show relevant skills, ownership, and outcomes.">
              {draft.projects.map((entry: ProjectEntry, index) => <div className="builder-entry" key={entry.id}>
                <EntryActions label={`project ${index + 1}`} index={index} count={draft.projects.length} onMove={(direction) => updateList('projects', moveItem(draft.projects, index, direction))} onRemove={() => updateList('projects', draft.projects.filter((_, itemIndex) => itemIndex !== index))} />
                <div className="builder-fields two-columns">
                  <Field label="Project name" value={entry.name} onChange={(name) => updateEntry('projects', index, { ...entry, name })} placeholder="Career guidance dashboard" />
                  <Field label="Technologies" value={entry.technologies} onChange={(technologies) => updateEntry('projects', index, { ...entry, technologies })} placeholder="React, TypeScript, Vite" />
                  <Field label="Dates" value={entry.dates} onChange={(dates) => updateEntry('projects', index, { ...entry, dates })} placeholder="Jan. 2026 - Present" />
                </div>
                <BulletEditor bullets={entry.bullets} onChange={(bullets) => updateEntry('projects', index, { ...entry, bullets })} />
              </div>)}
              <button className="add-entry-button" type="button" onClick={() => updateList('projects', [...draft.projects, createProject()])} disabled={draft.projects.length >= resumeLimits.projects}>+ Add project</button>
            </BuilderSection>

            <BuilderSection title="Technical skills" description="Group related tools and use the names recruiters will recognise.">
              {draft.skills.map((entry: SkillGroup, index) => <div className="builder-entry compact-entry" key={entry.id}>
                <EntryActions label={`skill group ${index + 1}`} index={index} count={draft.skills.length} onMove={(direction) => updateList('skills', moveItem(draft.skills, index, direction))} onRemove={() => updateList('skills', draft.skills.filter((_, itemIndex) => itemIndex !== index))} />
                <div className="builder-fields skill-fields">
                  <Field label="Category" value={entry.label} onChange={(label) => updateEntry('skills', index, { ...entry, label })} placeholder="Languages" />
                  <Field label="Skills" value={entry.skills} onChange={(skills) => updateEntry('skills', index, { ...entry, skills })} placeholder="Java, Python, SQL, JavaScript" />
                </div>
              </div>)}
              <button className="add-entry-button" type="button" onClick={() => updateList('skills', [...draft.skills, createSkillGroup()])} disabled={draft.skills.length >= resumeLimits.skills}>+ Add skill group</button>
            </BuilderSection>

            <BuilderSection title="Custom sections" description="Add concise sections such as Certifications, Leadership, or Achievements.">
              {draft.customSections.map((entry: CustomSection, index) => <div className="builder-entry" key={entry.id}>
                <EntryActions label={`custom section ${index + 1}`} index={index} count={draft.customSections.length} onMove={(direction) => updateList('customSections', moveItem(draft.customSections, index, direction))} onRemove={() => updateList('customSections', draft.customSections.filter((_, itemIndex) => itemIndex !== index))} />
                <Field label="Section title" value={entry.title} onChange={(title) => updateEntry('customSections', index, { ...entry, title })} placeholder="Certifications" />
                <BulletEditor bullets={entry.bullets} onChange={(bullets) => updateEntry('customSections', index, { ...entry, bullets })} />
              </div>)}
              <button className="add-entry-button" type="button" onClick={() => updateList('customSections', [...draft.customSections, createCustomSection()])} disabled={draft.customSections.length >= resumeLimits.customSections}>+ Add custom section</button>
            </BuilderSection>
          </form>

          <aside className="builder-preview-panel">
            <div className="preview-toolbar">
              <div><span>Live preview</span><small>Jake's Resume layout</small></div>
              <button type="button" onClick={() => void handleDownload()} disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
            <div className="generation-status" aria-live="polite">
              {generationError && <p className="generation-error" role="alert">{generationError}</p>}
              {lengthWarning && <p className="length-warning">{lengthWarning}</p>}
            </div>
            <ResumePreview draft={draft} />
            <p className="preview-footnote">Your resume stays in this browser and is not stored by CGC.</p>
          </aside>
        </div>
      </main>
      <footer>CGC provides learning guidance, not hiring predictions.</footer>
    </div>
  )
}
