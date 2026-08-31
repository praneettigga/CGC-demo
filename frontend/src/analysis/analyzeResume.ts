import {
  categoryLabels,
  roles,
  skillCategories,
  skills,
  type RoleDefinition,
  type SkillDefinition,
} from '../data/careerData'
import type { ResumeAnalysis, RoleMatch, SkillResult } from './types'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function includesPhrase(text: string, phrase: string) {
  const escaped = escapeRegExp(phrase.toLowerCase())
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(text)
}

function hasContextualMention(text: string, alias: string) {
  const escaped = escapeRegExp(alias.toLowerCase())
  const matcher = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'gi')
  const context = /\b(skills?|tools?|technologies|technical|projects?|coursework|languages|certifications?|proficient|experience)\b/i

  for (const match of text.matchAll(matcher)) {
    const index = match.index ?? 0
    const window = text.slice(Math.max(0, index - 100), index + alias.length + 100)
    if (context.test(window)) {
      return true
    }
  }

  return false
}

function findSkills(text: string): SkillDefinition[] {
  return skills.filter((skill) =>
    skill.aliases.some((alias) =>
      skill.requiresContext
        ? hasContextualMention(text, alias)
        : includesPhrase(text, alias),
    ),
  )
}

function toSkillResult(skill: SkillDefinition): SkillResult {
  return { id: skill.id, name: skill.name, category: skill.category }
}

function hasAnyPhrase(text: string, phrases: string[]) {
  return phrases.some((phrase) => includesPhrase(text, phrase))
}

function scoreRole(
  role: RoleDefinition,
  recognisedIds: Set<string>,
  text: string,
  hasProjects: boolean,
  hasCoursework: boolean,
) {
  const matchedEssential = role.essentialSkillIds.filter((id) => recognisedIds.has(id))
  const matchedSupporting = role.supportingSkillIds.filter((id) => recognisedIds.has(id))
  const totalWeight = role.essentialSkillIds.length * 7 + role.supportingSkillIds.length * 3
  const matchedWeight = matchedEssential.length * 7 + matchedSupporting.length * 3
  const skillScore = (matchedWeight / totalWeight) * 85
  const projectBonus = hasProjects
    ? hasAnyPhrase(text, role.projectTerms)
      ? 8
      : 2
    : 0
  const courseworkBonus = hasCoursework && hasAnyPhrase(text, role.courseworkTerms) ? 4 : 0
  const degreeBonus = hasAnyPhrase(text, role.degreeTerms) ? 3 : 0

  return {
    matchedEssential,
    matchedSupporting,
    missingEssential: role.essentialSkillIds.filter((id) => !recognisedIds.has(id)),
    matchPercentage: Math.round(Math.min(100, skillScore + projectBonus + courseworkBonus + degreeBonus)),
  }
}

function rankRoles(
  recognisedIds: Set<string>,
  text: string,
  hasProjects: boolean,
  hasCoursework: boolean,
): RoleMatch[] {
  return roles
    .map((role) => {
      const result = scoreRole(role, recognisedIds, text, hasProjects, hasCoursework)
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        matchPercentage: result.matchPercentage,
        matchedSkills: [...result.matchedEssential, ...result.matchedSupporting].map(
          (id) => skills.find((skill) => skill.id === id)!.name,
        ),
        missingSkills: result.missingEssential.map(
          (id) => skills.find((skill) => skill.id === id)!.name,
        ),
      }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage || a.name.localeCompare(b.name))
    .slice(0, 3)
}

function buildExplanation(score: number, strongest: SkillResult[], roleMatches: RoleMatch[]) {
  const skillSummary = strongest.slice(0, 2).map((skill) => skill.name).join(' and ')
  const role = roleMatches[0]?.name ?? 'technology'

  if (score >= 75) {
    return `Strong foundation for ${role}, supported by ${skillSummary}. Focus next on the remaining role skills.`
  }
  if (score >= 45) {
    return `A promising start for ${role}, with strengths in ${skillSummary}. Add a focused project and fill the key skill gaps.`
  }
  return `Your resume shows an early ${role} foundation through ${skillSummary}. Build one small project and add the missing core skills.`
}

export function analyzeResume(text: string): ResumeAnalysis {
  const normalisedText = text.toLowerCase()
  const recognised = findSkills(normalisedText)

  if (recognised.length === 0) {
    throw new Error('NO_RECOGNISED_SKILLS')
  }

  const recognisedIds = new Set(recognised.map((skill) => skill.id))
  const hasProjects = /\b(project|projects|portfolio|built|developed|created)\b/i.test(text)
  const hasExperience = /\b(intern|internship|experience|employment|worked|work history)\b/i.test(text)
  const hasEducation = /\b(degree|bachelor|master|b\.?tech|b\.?e\.?|bsc|msc|education|certificate|certification)\b/i.test(text)
  const hasCoursework = /\b(coursework|course work|courses?|subjects?)\b/i.test(text)

  const score = Math.min(
    100,
    recognised.length * 6 +
      (hasProjects ? 15 : 0) +
      (hasExperience ? 15 : 0) +
      (hasEducation ? 10 : 0),
  )

  const roleMatches = rankRoles(recognisedIds, normalisedText, hasProjects, hasCoursework)
  const relevance = new Map(
    skills.map((skill) => [
      skill.id,
      roles.filter(
        (role) =>
          role.essentialSkillIds.includes(skill.id) || role.supportingSkillIds.includes(skill.id),
      ).length,
    ]),
  )
  const topRoleDefinition = roles.find((role) => role.id === roleMatches[0]?.id)
  const strongestSkills = [...recognised]
    .sort(
      (a, b) =>
        Number(topRoleDefinition?.essentialSkillIds.includes(b.id)) * 2 +
          Number(topRoleDefinition?.supportingSkillIds.includes(b.id)) -
          Number(topRoleDefinition?.essentialSkillIds.includes(a.id)) * 2 -
          Number(topRoleDefinition?.supportingSkillIds.includes(a.id)) ||
        (relevance.get(b.id) ?? 0) - (relevance.get(a.id) ?? 0) ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 5)
    .map(toSkillResult)

  const recommendedSkills = roleMatches
    .flatMap((role) => role.missingSkills)
    .filter((name, index, all) => all.indexOf(name) === index)
    .slice(0, 3)

  const focusSkills = recommendedSkills.length
    ? recommendedSkills.join(', ')
    : 'one advanced skill in your strongest area'
  const topRoleSkillIds = new Set([
    ...(topRoleDefinition?.essentialSkillIds ?? []),
    ...(topRoleDefinition?.supportingSkillIds ?? []),
  ])

  return {
    score,
    explanation: buildExplanation(score, strongestSkills, roleMatches),
    recognisedSkills: recognised.map(toSkillResult),
    strongestSkills,
    roleMatches,
    recommendedSkills,
    categoryScores: skillCategories.map((category) => {
      const categorySkills = skills.filter(
        (skill) => skill.category === category && topRoleSkillIds.has(skill.id),
      )
      const matches = categorySkills.filter((skill) => recognisedIds.has(skill.id))
      return {
        category,
        score: categorySkills.length
          ? Math.round((matches.length / categorySkills.length) * 100)
          : 0,
      }
    }),
    roadmap: [
      {
        period: 'Days 1–30',
        title: 'Learn the gaps',
        description: `Practise ${focusSkills} with short, focused exercises.`,
      },
      {
        period: 'Days 31–60',
        title: 'Build one project',
        description: `Create a small ${roleMatches[0].name} project that uses your new and existing skills.`,
      },
      {
        period: 'Days 61–90',
        title: 'Polish and share',
        description: 'Improve the README, test the project, deploy it, and add the result to your resume.',
      },
    ],
    signals: { hasProjects, hasExperience, hasEducation },
  }
}

export function getAnalysisErrorMessage(error: unknown) {
  if (error instanceof Error && error.message === 'NO_RECOGNISED_SKILLS') {
    return 'We could not find enough recognised technology skills in this resume. Add a skills section or try another PDF.'
  }
  return 'We could not analyse this resume. Please try another PDF.'
}

export { categoryLabels }
