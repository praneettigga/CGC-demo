const limits = {
  education: 6,
  experience: 8,
  projects: 8,
  skills: 8,
  customSections: 6,
  bulletsPerEntry: 8,
  totalBullets: 40,
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function cleanText(value, field, errors, maxLength = 160) {
  if (typeof value !== 'string') {
    errors.push(`${field} must be text.`)
    return ''
  }

  const cleaned = value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim()
  if (cleaned.length > maxLength) errors.push(`${field} must be ${maxLength} characters or fewer.`)
  return cleaned.slice(0, maxLength)
}

function cleanOptionalText(value, field, errors, maxLength = 160) {
  if (value === undefined || value === null) return ''
  return cleanText(value, field, errors, maxLength)
}

function cleanArray(value, field, errors, maxItems, cleaner) {
  if (!Array.isArray(value)) {
    errors.push(`${field} must be a list.`)
    return []
  }
  if (value.length > maxItems) errors.push(`${field} can contain at most ${maxItems} items.`)
  return value.slice(0, maxItems).map((item, index) => cleaner(item, `${field}[${index}]`, errors))
}

function cleanBullets(value, field, errors) {
  return cleanArray(value, field, errors, limits.bulletsPerEntry, (bullet, bulletField, bulletErrors) =>
    cleanText(bullet, bulletField, bulletErrors, 500),
  ).filter(Boolean)
}

function cleanEducation(value, field, errors) {
  if (!isObject(value)) {
    errors.push(`${field} must be an object.`)
    return { school: '', location: '', qualification: '', dates: '' }
  }
  return {
    school: cleanOptionalText(value.school, `${field}.school`, errors),
    location: cleanOptionalText(value.location, `${field}.location`, errors),
    qualification: cleanOptionalText(value.qualification, `${field}.qualification`, errors, 220),
    dates: cleanOptionalText(value.dates, `${field}.dates`, errors),
  }
}

function cleanExperience(value, field, errors) {
  if (!isObject(value)) {
    errors.push(`${field} must be an object.`)
    return { role: '', dates: '', organisation: '', location: '', bullets: [] }
  }
  return {
    role: cleanOptionalText(value.role, `${field}.role`, errors),
    dates: cleanOptionalText(value.dates, `${field}.dates`, errors),
    organisation: cleanOptionalText(value.organisation, `${field}.organisation`, errors),
    location: cleanOptionalText(value.location, `${field}.location`, errors),
    bullets: cleanBullets(value.bullets ?? [], `${field}.bullets`, errors),
  }
}

function cleanProject(value, field, errors) {
  if (!isObject(value)) {
    errors.push(`${field} must be an object.`)
    return { name: '', technologies: '', dates: '', bullets: [] }
  }
  return {
    name: cleanOptionalText(value.name, `${field}.name`, errors),
    technologies: cleanOptionalText(value.technologies, `${field}.technologies`, errors, 260),
    dates: cleanOptionalText(value.dates, `${field}.dates`, errors),
    bullets: cleanBullets(value.bullets ?? [], `${field}.bullets`, errors),
  }
}

function cleanSkillGroup(value, field, errors) {
  if (!isObject(value)) {
    errors.push(`${field} must be an object.`)
    return { label: '', skills: '' }
  }
  return {
    label: cleanOptionalText(value.label, `${field}.label`, errors, 80),
    skills: cleanOptionalText(value.skills, `${field}.skills`, errors, 500),
  }
}

function cleanCustomSection(value, field, errors) {
  if (!isObject(value)) {
    errors.push(`${field} must be an object.`)
    return { title: '', bullets: [] }
  }
  return {
    title: cleanOptionalText(value.title, `${field}.title`, errors, 80),
    bullets: cleanBullets(value.bullets ?? [], `${field}.bullets`, errors),
  }
}

function hasEducation(entry) {
  return entry.school || entry.location || entry.qualification || entry.dates
}

function hasExperience(entry) {
  return entry.role || entry.organisation || entry.location || entry.dates || entry.bullets.length
}

function hasProject(entry) {
  return entry.name || entry.technologies || entry.dates || entry.bullets.length
}

export function validateResumePayload(value) {
  const errors = []
  if (!isObject(value)) return { ok: false, errors: ['Request body must be an object.'] }

  const contactValue = isObject(value.contact) ? value.contact : {}
  if (!isObject(value.contact)) errors.push('contact must be an object.')
  const contact = {
    fullName: cleanOptionalText(contactValue.fullName, 'contact.fullName', errors, 120),
    phone: cleanOptionalText(contactValue.phone, 'contact.phone', errors, 60),
    email: cleanOptionalText(contactValue.email, 'contact.email', errors, 180),
    linkedin: cleanOptionalText(contactValue.linkedin, 'contact.linkedin', errors, 240),
    github: cleanOptionalText(contactValue.github, 'contact.github', errors, 240),
    portfolio: cleanOptionalText(contactValue.portfolio, 'contact.portfolio', errors, 240),
  }

  if (!contact.fullName) errors.push('Full name is required.')
  if (!contact.email) errors.push('Email is required.')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errors.push('Email is not valid.')

  const education = cleanArray(value.education ?? [], 'education', errors, limits.education, cleanEducation).filter(hasEducation)
  const experience = cleanArray(value.experience ?? [], 'experience', errors, limits.experience, cleanExperience).filter(hasExperience)
  const projects = cleanArray(value.projects ?? [], 'projects', errors, limits.projects, cleanProject).filter(hasProject)
  const skills = cleanArray(value.skills ?? [], 'skills', errors, limits.skills, cleanSkillGroup).filter((entry) => entry.label && entry.skills)
  const customSections = cleanArray(value.customSections ?? [], 'customSections', errors, limits.customSections, cleanCustomSection).filter((entry) => entry.title && entry.bullets.length)

  const totalBullets = [
    ...experience.flatMap((entry) => entry.bullets),
    ...projects.flatMap((entry) => entry.bullets),
    ...customSections.flatMap((entry) => entry.bullets),
  ].length
  if (totalBullets > limits.totalBullets) errors.push(`Resume can contain at most ${limits.totalBullets} bullet points.`)
  if (education.length + experience.length + projects.length + skills.length + customSections.length === 0) {
    errors.push('Add at least one resume section before generating a PDF.')
  }

  if (errors.length) return { ok: false, errors }
  return { ok: true, data: { contact, education, experience, projects, skills, customSections } }
}

export { limits }
