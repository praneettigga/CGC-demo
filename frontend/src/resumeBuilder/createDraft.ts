import type {
  CustomSection,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeDraft,
  SkillGroup,
} from './types'

let nextId = 0

function id(prefix: string) {
  nextId += 1
  return `${prefix}-${nextId}`
}

export function createEducation(): EducationEntry {
  return { id: id('education'), school: '', location: '', qualification: '', dates: '' }
}

export function createExperience(): ExperienceEntry {
  return {
    id: id('experience'),
    role: '',
    dates: '',
    organisation: '',
    location: '',
    bullets: [''],
  }
}

export function createProject(): ProjectEntry {
  return { id: id('project'), name: '', technologies: '', dates: '', bullets: [''] }
}

export function createSkillGroup(label = ''): SkillGroup {
  return { id: id('skills'), label, skills: '' }
}

export function createCustomSection(): CustomSection {
  return { id: id('custom'), title: '', bullets: [''] }
}

export function createResumeDraft(): ResumeDraft {
  return {
    contact: {
      fullName: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
      portfolio: '',
    },
    education: [createEducation()],
    experience: [createExperience()],
    projects: [createProject()],
    skills: [
      createSkillGroup('Languages'),
      createSkillGroup('Frameworks'),
      createSkillGroup('Developer Tools'),
      createSkillGroup('Libraries'),
    ],
    customSections: [],
  }
}
