import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import test from 'node:test'
import { compileResume } from '../src/compile.mjs'
import { validResume } from './fixture.mjs'

const hasPdfLatex = spawnSync('pdflatex', ['--version'], { stdio: 'ignore' }).status === 0

test('compiles a valid one-page PDF and removes temporary files', { skip: !hasPdfLatex }, async () => {
  const before = new Set((await readdir(tmpdir())).filter((name) => name.startsWith('cgc-resume-')))
  const pdf = await compileResume(validResume)
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  const after = (await readdir(tmpdir())).filter((name) => name.startsWith('cgc-resume-') && !before.has(name))
  assert.deepEqual(after, [])
})
