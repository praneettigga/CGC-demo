import assert from 'node:assert/strict'
import test from 'node:test'
import { buildLatex, escapeLatex } from '../src/latex.mjs'
import { validateResumePayload } from '../src/validate.mjs'
import { validResume } from './fixture.mjs'

test('escapes every LaTeX control character in student text', () => {
  assert.equal(
    escapeLatex('C\\C++ & 30%_done #1 $5 {ok} ~ ^'),
    'C\\textbackslash{}C++ \\& 30\\%\\_done \\#1 \\$5 \\{ok\\} \\textasciitilde{} \\textasciicircum{}',
  )
})

test('builds the fixed Jake template without accepting raw LaTeX', () => {
  const resume = structuredClone(validResume)
  resume.experience[0].bullets = ['Improved A&B by 25% using C_C. \\input{secret}']
  const latex = buildLatex(resume)
  assert.match(latex, /Jake Gutierrez/)
  assert.match(latex, /Improved A\\&B by 25\\% using C\\_C\./)
  assert.doesNotMatch(latex, /\\input\{secret\}/)
  assert.match(latex, /\\textbackslash\{\}input\\\{secret\\\}/)
})

test('validates and removes blank placeholder entries', () => {
  const payload = structuredClone(validResume)
  payload.projects.push({ name: '', technologies: '', dates: '', bullets: [''] })
  const result = validateResumePayload(payload)
  assert.equal(result.ok, true)
  assert.equal(result.data.projects.length, 1)
})

test('rejects missing identity, malformed email, and excessive bullets', () => {
  const payload = structuredClone(validResume)
  payload.contact.fullName = ''
  payload.contact.email = 'invalid'
  payload.projects[0].bullets = Array.from({ length: 9 }, () => 'bullet')
  const result = validateResumePayload(payload)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('Full name')))
  assert.ok(result.errors.some((error) => error.includes('Email is not valid')))
  assert.ok(result.errors.some((error) => error.includes('at most 8')))
})
