export interface ContactDetails {
  fullName: string
  phone: string
  email: string
  linkedin: string
  github: string
  portfolio: string
}

export interface EducationEntry {
  id: string
  school: string
  location: string
  qualification: string
  dates: string
}

export interface ExperienceEntry {
  id: string
  role: string
  dates: string
  organisation: string
  location: string
  bullets: string[]
}

export interface ProjectEntry {
  id: string
  name: string
  technologies: string
  dates: string
  bullets: string[]
}

export interface SkillGroup {
  id: string
  label: string
  skills: string
}

export interface CustomSection {
  id: string
  title: string
  bullets: string[]
}

export interface ResumeDraft {
  contact: ContactDetails
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  skills: SkillGroup[]
  customSections: CustomSection[]
}
