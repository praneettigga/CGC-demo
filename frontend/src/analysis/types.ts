import type { SkillCategory } from '../data/careerData'

export interface SkillResult {
  id: string
  name: string
  category: SkillCategory
}

export interface RoleMatch {
  id: string
  name: string
  description: string
  matchPercentage: number
  matchedSkills: string[]
  missingSkills: string[]
}

export interface CategoryScore {
  category: SkillCategory
  score: number
}

export interface RoadmapStep {
  period: string
  title: string
  description: string
}

export interface ResumeAnalysis {
  score: number
  explanation: string
  recognisedSkills: SkillResult[]
  strongestSkills: SkillResult[]
  roleMatches: RoleMatch[]
  recommendedSkills: string[]
  categoryScores: CategoryScore[]
  roadmap: RoadmapStep[]
  signals: {
    hasProjects: boolean
    hasExperience: boolean
    hasEducation: boolean
  }
}
