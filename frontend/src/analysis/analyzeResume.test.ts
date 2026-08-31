import { analyzeResume, getAnalysisErrorMessage } from './analyzeResume'
import { knowledgeVersion, roles, skills } from '../data/careerData'

const strongResume = `
  Bachelor of Technology
  Skills: JavaScript, React, HTML, CSS, Git, Node.js, SQL, PostgreSQL, Docker, AWS
  Projects: Built and deployed a responsive student portal.
  Experience: Frontend development internship.
`

describe('analyzeResume', () => {
  it('recognises skills and returns the best three deterministic role matches', () => {
    const result = analyzeResume(strongResume)

    expect(result.recognisedSkills.map((skill) => skill.name)).toContain('React')
    expect(result.roleMatches).toHaveLength(3)
    expect(result.roleMatches[0].name).toBe('Full-Stack Developer')
    expect(result.roleMatches[0].matchPercentage).toBe(75)
  })

  it('keeps the readiness score between 0 and 100', () => {
    expect(analyzeResume(strongResume).score).toBe(100)
    expect(analyzeResume('Skills: HTML').score).toBeGreaterThanOrEqual(0)
    expect(analyzeResume('Skills: HTML').score).toBeLessThanOrEqual(100)
  })

  it('measures category coverage against the top matched role', () => {
    const result = analyzeResume(strongResume)
    expect(result.categoryScores).toHaveLength(9)
    expect(result.categoryScores.find((score) => score.category === 'cloud-devops')?.score).toBe(100)
  })

  it('detects profile signals and produces a three-step roadmap', () => {
    const result = analyzeResume(strongResume)
    expect(result.signals).toEqual({
      hasProjects: true,
      hasExperience: true,
      hasEducation: true,
    })
    expect(result.roadmap).toHaveLength(3)
  })

  it('recommends missing skills from the strongest role matches', () => {
    const result = analyzeResume('JavaScript React HTML CSS project')
    expect(result.recommendedSkills.length).toBeGreaterThan(0)
    expect(result.recommendedSkills.length).toBeLessThanOrEqual(3)
  })

  it('matches aliases as words without partial false positives', () => {
    expect(() => analyzeResume('I adjust project schedules')).toThrow(
      'NO_RECOGNISED_SKILLS',
    )
    expect(analyzeResume('Worked with JS and ReactJS').recognisedSkills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'JavaScript' }),
        expect.objectContaining({ name: 'React' }),
      ]),
    )
  })

  it('matches short ambiguous terms only in a resume-relevant context', () => {
    expect(() => analyzeResume('Received grade C in a history course.')).toThrow(
      'NO_RECOGNISED_SKILLS',
    )

    expect(analyzeResume('Skills: C, C++, CAD. Projects: CAD model.').recognisedSkills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'C' }),
        expect.objectContaining({ name: 'C++' }),
        expect.objectContaining({ name: 'CAD' }),
      ]),
    )
  })

  it.each([
    [
      'Computer Science',
      'Bachelor of Technology in Computer Science. Skills: Python, SQL, Pandas, scikit-learn, Statistics. Coursework: Machine Learning. Projects: Built a classification model.',
      'Machine Learning Engineer',
    ],
    [
      'Electronics',
      'B.Tech ECE. Skills: Embedded C, C++, Microcontrollers, Arduino, Circuit Design. Coursework: Embedded Systems. Projects: Built an IoT device.',
      'Embedded Systems Engineer',
    ],
    [
      'Mechanical',
      'B.E. Mechanical Engineering. Skills: SolidWorks, Mechanical Design, GD&T, AutoCAD, Manufacturing. Coursework: Machine Design. Projects: Designed a mechanical assembly.',
      'Mechanical Design Engineer',
    ],
    [
      'Civil',
      'B.Tech Civil Engineering. Skills: Structural Analysis, STAAD.Pro, AutoCAD, ETABS. Coursework: Structural Analysis. Projects: Completed a structural design.',
      'Structural Engineer',
    ],
    [
      'Chemical',
      'B.Tech Chemical Engineering. Skills: Process Engineering, Aspen HYSYS, Mass Transfer, Heat Transfer, P&ID. Coursework: Chemical Engineering. Projects: Process simulation for a chemical plant.',
      'Process Engineer',
    ],
  ])('ranks a representative %s resume for its discipline', (_discipline, resume, expectedRole) => {
    expect(analyzeResume(resume).roleMatches[0].name).toBe(expectedRole)
  })

  it('keeps the local engineering knowledge base internally consistent', () => {
    const skillIds = new Set(skills.map((skill) => skill.id))
    expect(knowledgeVersion).toMatch(/^2026\.08-engineering-/)
    expect(roles).toHaveLength(35)

    for (const role of roles) {
      expect([...role.essentialSkillIds, ...role.supportingSkillIds].every((id) => skillIds.has(id))).toBe(true)
    }
  })

  it('returns a clear no-skills message', () => {
    expect(getAnalysisErrorMessage(new Error('NO_RECOGNISED_SKILLS'))).toMatch(
      /could not find enough/i,
    )
  })
})
