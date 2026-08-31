import type { ResumeDraft } from './types'

export const resumeLimits = {
  education: 6,
  experience: 8,
  projects: 8,
  skills: 8,
  customSections: 6,
  bulletsPerEntry: 8,
  totalBullets: 40,
} as const

function hasText(value: string) {
  return value.trim().length > 0
}

function entryHasText(entry: Record<string, unknown>) {
  return Object.entries(entry).some(([key, value]) => {
    if (key === 'id') return false
    if (typeof value === 'string') return hasText(value)
    return Array.isArray(value) && value.some((item) => typeof item === 'string' && hasText(item))
  })
}

export function validateResumeDraft(draft: ResumeDraft) {
  const errors: string[] = []
  if (!hasText(draft.contact.fullName)) errors.push('Enter your full name.')
  if (!hasText(draft.contact.email)) errors.push('Enter your email address.')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email.trim())) errors.push('Enter a valid email address.')
  if (draft.education.length > resumeLimits.education) errors.push(`Use no more than ${resumeLimits.education} education entries.`)
  if (draft.experience.length > resumeLimits.experience) errors.push(`Use no more than ${resumeLimits.experience} experience entries.`)
  if (draft.projects.length > resumeLimits.projects) errors.push(`Use no more than ${resumeLimits.projects} projects.`)
  if (draft.skills.length > resumeLimits.skills) errors.push(`Use no more than ${resumeLimits.skills} skill groups.`)
  if (draft.customSections.length > resumeLimits.customSections) errors.push(`Use no more than ${resumeLimits.customSections} custom sections.`)

  draft.education.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)).forEach((entry, index) => {
    if (!hasText(entry.school) || !hasText(entry.qualification)) errors.push(`Complete the school and qualification for education entry ${index + 1}.`)
  })
  draft.experience.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)).forEach((entry, index) => {
    if (!hasText(entry.role) || !hasText(entry.organisation)) errors.push(`Complete the role and organisation for experience entry ${index + 1}.`)
    if (!entry.bullets.some(hasText)) errors.push(`Add at least one bullet to experience entry ${index + 1}.`)
  })
  draft.projects.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)).forEach((entry, index) => {
    if (!hasText(entry.name)) errors.push(`Enter a name for project ${index + 1}.`)
    if (!entry.bullets.some(hasText)) errors.push(`Add at least one bullet to project ${index + 1}.`)
  })
  draft.skills.filter((entry) => hasText(entry.skills)).forEach((entry, index) => {
    if (!hasText(entry.label) || !hasText(entry.skills)) errors.push(`Complete both fields for skill group ${index + 1}.`)
  })
  draft.customSections.filter((entry) => hasText(entry.title) || entry.bullets.some(hasText)).forEach((entry, index) => {
    if (!hasText(entry.title)) errors.push(`Enter a title for custom section ${index + 1}.`)
    if (!entry.bullets.some(hasText)) errors.push(`Add at least one bullet to custom section ${index + 1}.`)
  })

  const contentSections = [
    ...draft.education.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)),
    ...draft.experience.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)),
    ...draft.projects.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)),
    ...draft.skills.filter((entry) => hasText(entry.skills)),
    ...draft.customSections.filter((entry) => entry.bullets.some(hasText)),
  ]
  if (contentSections.length === 0) errors.push('Add at least one resume section before generating a PDF.')

  const allBullets = [
    ...draft.experience.flatMap((entry) => entry.bullets),
    ...draft.projects.flatMap((entry) => entry.bullets),
    ...draft.customSections.flatMap((entry) => entry.bullets),
  ].filter(hasText)
  if (allBullets.length > resumeLimits.totalBullets) errors.push(`Use no more than ${resumeLimits.totalBullets} bullet points.`)
  if ([...draft.experience, ...draft.projects, ...draft.customSections].some((entry) => entry.bullets.length > resumeLimits.bulletsPerEntry)) {
    errors.push(`Use no more than ${resumeLimits.bulletsPerEntry} bullets in one entry.`)
  }
  if (allBullets.some((bullet) => bullet.length > 500)) errors.push('Keep each bullet point to 500 characters or fewer.')

  return errors
}

export function getResumeLengthWarning(draft: ResumeDraft) {
  const bulletLines = [
    ...draft.experience.flatMap((entry) => entry.bullets),
    ...draft.projects.flatMap((entry) => entry.bullets),
    ...draft.customSections.flatMap((entry) => entry.bullets),
  ].filter(hasText).reduce((total, bullet) => total + 1 + Math.floor(bullet.length / 95), 0)
  const entryLines = draft.education.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)).length * 2
    + draft.experience.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)).length * 2
    + draft.projects.filter((entry) => entryHasText(entry as unknown as Record<string, unknown>)).length
    + draft.skills.filter((entry) => hasText(entry.skills)).length
  const sectionCount = [
    draft.education.some((entry) => entryHasText(entry as unknown as Record<string, unknown>)),
    draft.experience.some((entry) => entryHasText(entry as unknown as Record<string, unknown>)),
    draft.projects.some((entry) => entryHasText(entry as unknown as Record<string, unknown>)),
    draft.skills.some((entry) => hasText(entry.skills)),
  ].filter(Boolean).length + draft.customSections.filter((entry) => entry.bullets.some(hasText)).length

  return bulletLines + entryLines + sectionCount * 2 > 42
    ? 'This draft may run beyond one page. Shorten bullets or remove less relevant entries before downloading.'
    : ''
}
