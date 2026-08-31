import { analyzeResume, getAnalysisErrorMessage } from './analyzeResume'

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
    expect(result.roleMatches[0].matchPercentage).toBe(100)
  })

  it('keeps the readiness score between 0 and 100', () => {
    expect(analyzeResume(strongResume).score).toBe(100)
    expect(analyzeResume('Skills: HTML').score).toBeGreaterThanOrEqual(0)
    expect(analyzeResume('Skills: HTML').score).toBeLessThanOrEqual(100)
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

  it('returns a clear no-skills message', () => {
    expect(getAnalysisErrorMessage(new Error('NO_RECOGNISED_SKILLS'))).toMatch(
      /could not find enough/i,
    )
  })
})
