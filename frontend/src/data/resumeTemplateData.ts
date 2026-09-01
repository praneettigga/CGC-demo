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
  previewImage?: string
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
    previewImage: '/2026-09-01-093200_hyprshot.png',
  },
  {
    id: 'ats-rating-resume',
    type: 'Template',
    title: '70+ ATS Rating Resume',
    source: 'Overleaf',
    description:
      'A detailed, ATS-friendly LaTeX resume template with clear sections for education, projects, experience, technical skills, and leadership.',
    bestFor: 'Engineering students who want a structured, content-rich technical resume.',
    tags: ['ATS-friendly layout', 'Detailed technical sections'],
    highlights: ['Clear section hierarchy', 'LaTeX source available', 'MIT licensed'],
    url: 'https://www.overleaf.com/latex/templates/70-plus-ats-rating-resume-template/ssprfsctyddz',
    preview: 'classic',
    previewImage: '/2026-09-01-093955_hyprshot.png',
  },
  {
    id: 'off-campus-template',
    type: 'Template',
    title: 'Off-Campus Resume Template',
    source: 'Overleaf',
    description:
      'A compact technical resume template with dedicated sections for internships, projects, achievements, coursework, skills, and leadership roles.',
    bestFor: 'Students applying for off-campus internships and entry-level technical roles.',
    tags: ['Off-campus applications', 'Achievements and coursework'],
    highlights: ['Compact one-page format', 'LaTeX source available', 'Project-focused structure'],
    url: 'https://www.overleaf.com/latex/templates/off-campus-template/ygwmktvmvhjm',
    preview: 'classic',
    previewImage: '/2026-09-01-094249_hyprshot.png',
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
