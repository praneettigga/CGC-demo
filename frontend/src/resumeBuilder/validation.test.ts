import { createResumeDraft } from './createDraft'
import { getResumeLengthWarning, validateResumeDraft } from './validation'

function validDraft() {
  const draft = createResumeDraft()
  draft.contact.fullName = 'Asha Tigga'
  draft.contact.email = 'asha@example.com'
  draft.education[0] = {
    ...draft.education[0],
    school: 'CGC University',
    qualification: 'B.Tech in Computer Science',
  }
  return draft
}

describe('resume builder validation', () => {
  it('accepts a complete minimal resume', () => {
    expect(validateResumeDraft(validDraft())).toEqual([])
  })

  it('requires identity and at least one complete section', () => {
    const draft = createResumeDraft()
    expect(validateResumeDraft(draft)).toEqual(expect.arrayContaining([
      'Enter your full name.',
      'Enter your email address.',
      'Add at least one resume section before generating a PDF.',
    ]))
  })

  it('warns when estimated content is too long for one page', () => {
    const draft = validDraft()
    draft.projects[0] = {
      ...draft.projects[0],
      name: 'Large project',
      bullets: Array.from({ length: 8 }, () => 'Built and delivered a detailed engineering feature with measurable outcomes and extensive documentation for student users.'),
    }
    draft.experience[0] = {
      ...draft.experience[0],
      role: 'Engineering Intern',
      organisation: 'Example Labs',
      bullets: Array.from({ length: 8 }, () => 'Improved a production workflow through testing, automation, collaboration, and careful performance measurement.'),
    }
    expect(getResumeLengthWarning(draft)).toMatch(/beyond one page/i)
  })
})
