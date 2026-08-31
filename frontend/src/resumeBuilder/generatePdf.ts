import type { ResumeDraft } from './types'

export async function generateResumePdf(draft: ResumeDraft) {
  const response = await fetch('/api/resume-pdf', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(draft),
  })
  if (!response.ok) {
    let message = 'Your PDF could not be generated. Please try again.'
    try {
      const body = await response.json() as { error?: string; details?: string[] }
      if (body.details?.length) message = body.details[0]
      else if (body.error === 'RATE_LIMITED') message = 'Too many PDF requests. Please wait a minute and try again.'
      else if (body.error === 'COMPILER_UNAVAILABLE') message = 'The PDF service is temporarily unavailable. Please try again shortly.'
    } catch {
      // Use the safe generic message when the service returns a non-JSON error.
    }
    throw new Error(message)
  }
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.startsWith('application/pdf')) throw new Error('The PDF service returned an unexpected response.')
  return response.blob()
}

export function downloadResumePdf(pdf: Blob, fullName: string) {
  const safeName = fullName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resume'
  const url = URL.createObjectURL(pdf)
  const link = document.createElement('a')
  link.href = url
  link.download = `${safeName}-resume.pdf`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
