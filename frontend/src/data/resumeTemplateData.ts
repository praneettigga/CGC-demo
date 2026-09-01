export interface ResumeTemplateResource {
  id: string
  type: 'Template' | 'Writing guide'
  title: string
  source: string
  description: string
  bestFor: string
  tags: string[]
  highlights: string[]
  url: string
  preview: 'classic' | 'developer'
}

export const resumeTemplateResources: ResumeTemplateResource[] = [
  {
    id: 'jakes-resume',
    type: 'Template',
    title: "Jake's Resume",
    source: 'Overleaf',
    description:
      'A clean, single-column LaTeX resume template with space for education, experience, projects, and technical skills.',
    bestFor: 'CS and engineering students who want a concise technical resume.',
    tags: ['One-page technical layout', 'Projects up front'],
    highlights: ['Simple one-page structure', 'LaTeX source available', 'MIT licensed'],
    url: 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs',
    preview: 'classic',
  },
  {
    id: 'effective-developer-resume',
    type: 'Writing guide',
    title: 'Effective developer resume',
    source: 'Stack Overflow Blog',
    description:
      'Hiring-manager advice for making a developer resume easy to scan and putting the most relevant evidence first.',
    bestFor: 'Students tailoring a resume to a software or engineering role.',
    tags: ['Role-tailored content', 'Easy recruiter scanning'],
    highlights: ['Single-column scanning', 'Relevant work first', 'Clear technology section'],
    url: 'https://stackoverflow.blog/2020/11/25/how-to-write-an-effective-developer-resume-advice-from-a-hiring-manager/',
    preview: 'developer',
  },
]
