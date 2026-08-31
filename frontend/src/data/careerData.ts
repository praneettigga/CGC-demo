export const skillCategories = [
  'frontend',
  'backend',
  'databases',
  'cloud',
  'devops',
  'ai-ml',
] as const

export type SkillCategory = (typeof skillCategories)[number]

export const categoryLabels: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  databases: 'Databases',
  cloud: 'Cloud',
  devops: 'DevOps',
  'ai-ml': 'AI / ML',
}

export interface SkillDefinition {
  id: string
  name: string
  category: SkillCategory
  aliases: string[]
}

export interface RoleDefinition {
  id: string
  name: string
  description: string
  skillIds: string[]
}

export const skills: SkillDefinition[] = [
  { id: 'javascript', name: 'JavaScript', category: 'frontend', aliases: ['javascript', 'js'] },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', aliases: ['typescript'] },
  { id: 'react', name: 'React', category: 'frontend', aliases: ['react', 'react.js', 'reactjs'] },
  { id: 'html', name: 'HTML', category: 'frontend', aliases: ['html', 'html5'] },
  { id: 'css', name: 'CSS', category: 'frontend', aliases: ['css', 'css3'] },
  { id: 'node', name: 'Node.js', category: 'backend', aliases: ['node.js', 'nodejs'] },
  { id: 'express', name: 'Express', category: 'backend', aliases: ['express', 'express.js', 'expressjs'] },
  { id: 'java', name: 'Java', category: 'backend', aliases: ['java'] },
  { id: 'spring', name: 'Spring Boot', category: 'backend', aliases: ['spring boot', 'springboot'] },
  { id: 'python', name: 'Python', category: 'backend', aliases: ['python'] },
  { id: 'sql', name: 'SQL', category: 'databases', aliases: ['sql'] },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', aliases: ['postgresql', 'postgres'] },
  { id: 'mysql', name: 'MySQL', category: 'databases', aliases: ['mysql'] },
  { id: 'mongodb', name: 'MongoDB', category: 'databases', aliases: ['mongodb', 'mongo db'] },
  { id: 'aws', name: 'AWS', category: 'cloud', aliases: ['aws', 'amazon web services'] },
  { id: 'azure', name: 'Azure', category: 'cloud', aliases: ['azure', 'microsoft azure'] },
  { id: 'gcp', name: 'Google Cloud', category: 'cloud', aliases: ['gcp', 'google cloud'] },
  { id: 'git', name: 'Git', category: 'devops', aliases: ['git', 'github', 'gitlab'] },
  { id: 'docker', name: 'Docker', category: 'devops', aliases: ['docker'] },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', aliases: ['kubernetes', 'k8s'] },
  { id: 'ci-cd', name: 'CI / CD', category: 'devops', aliases: ['ci/cd', 'ci cd', 'continuous integration'] },
  { id: 'linux', name: 'Linux', category: 'devops', aliases: ['linux'] },
  { id: 'excel', name: 'Excel', category: 'ai-ml', aliases: ['excel', 'microsoft excel'] },
  { id: 'power-bi', name: 'Power BI', category: 'ai-ml', aliases: ['power bi', 'powerbi'] },
  { id: 'pandas', name: 'Pandas', category: 'ai-ml', aliases: ['pandas'] },
  { id: 'machine-learning', name: 'Machine Learning', category: 'ai-ml', aliases: ['machine learning', 'ml'] },
]

export const roles: RoleDefinition[] = [
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    description: 'Builds accessible, responsive interfaces for the web.',
    skillIds: ['javascript', 'typescript', 'react', 'html', 'css', 'git'],
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    description: 'Builds APIs, services, and dependable data-driven systems.',
    skillIds: ['javascript', 'node', 'express', 'sql', 'postgresql', 'git'],
  },
  {
    id: 'full-stack-developer',
    name: 'Full-Stack Developer',
    description: 'Works across user interfaces, APIs, and databases.',
    skillIds: ['javascript', 'react', 'node', 'sql', 'git', 'docker'],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Turns raw data into clear findings and visual reports.',
    skillIds: ['python', 'sql', 'excel', 'power-bi', 'pandas'],
  },
  {
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    description: 'Deploys and maintains reliable cloud infrastructure.',
    skillIds: ['aws', 'docker', 'kubernetes', 'git', 'ci-cd', 'linux'],
  },
]
