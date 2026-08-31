import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildLatex } from './latex.mjs'

const COMPILE_TIMEOUT_MS = 12_000

function runPdfLatex(directory) {
  return new Promise((resolve, reject) => {
    const child = spawn('pdflatex', [
      '-no-shell-escape',
      '-interaction=nonstopmode',
      '-halt-on-error',
      '-output-directory', directory,
      join(directory, 'resume.tex'),
    ], {
      cwd: directory,
      env: { ...process.env, openout_any: 'p', shell_escape: 'f' },
      stdio: ['ignore', 'ignore', 'ignore'],
    })
    const timeout = setTimeout(() => {
      child.kill('SIGKILL')
      reject(new Error('COMPILE_TIMEOUT'))
    }, COMPILE_TIMEOUT_MS)
    child.once('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
    child.once('exit', (code) => {
      clearTimeout(timeout)
      code === 0 ? resolve() : reject(new Error('COMPILE_FAILED'))
    })
  })
}

export async function compileResume(resume) {
  const directory = await mkdtemp(join(tmpdir(), 'cgc-resume-'))
  try {
    await writeFile(join(directory, 'resume.tex'), buildLatex(resume), { encoding: 'utf8', mode: 0o600 })
    await runPdfLatex(directory)
    return await readFile(join(directory, 'resume.pdf'))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
