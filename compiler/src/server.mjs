import { createHmac, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { compileResume } from './compile.mjs'
import { validateResumePayload } from './validate.mjs'

const PORT = Number(process.env.PORT || 8080)
const MAX_BODY_BYTES = 64 * 1024
const SIGNATURE_TOLERANCE_SECONDS = 60

function json(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  response.end(JSON.stringify(body))
}

function verifySignature(body, headers, secret) {
  if (!secret) return process.env.NODE_ENV === 'test'
  if (secret.length < 32) return false
  const timestamp = headers['x-cgc-timestamp']
  const provided = headers['x-cgc-signature']
  if (typeof timestamp !== 'string' || typeof provided !== 'string') return false
  const timestampNumber = Number(timestamp)
  if (!Number.isFinite(timestampNumber) || Math.abs(Date.now() / 1000 - timestampNumber) > SIGNATURE_TOLERANCE_SECONDS) return false
  const expected = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')
  const expectedBytes = Buffer.from(expected)
  const providedBytes = Buffer.from(provided)
  return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes)
}

async function readBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('BODY_TOO_LARGE')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

export function createResumeCompilerServer({ signingSecret = process.env.COMPILER_SIGNING_SECRET, compile = compileResume } = {}) {
  return createServer(async (request, response) => {
    response.setHeader('x-content-type-options', 'nosniff')
    if (request.method === 'GET' && request.url === '/health') return json(response, 200, { status: 'ok' })
    if (request.method !== 'POST' || request.url !== '/compile') return json(response, 404, { error: 'NOT_FOUND' })
    if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) {
      return json(response, 415, { error: 'UNSUPPORTED_MEDIA_TYPE' })
    }

    let rawBody
    try {
      rawBody = await readBody(request)
    } catch (error) {
      return json(response, error.message === 'BODY_TOO_LARGE' ? 413 : 400, { error: error.message })
    }
    if (!verifySignature(rawBody, request.headers, signingSecret)) return json(response, 401, { error: 'INVALID_SIGNATURE' })

    let body
    try {
      body = JSON.parse(rawBody)
    } catch {
      return json(response, 400, { error: 'INVALID_JSON' })
    }
    const validation = validateResumePayload(body)
    if (!validation.ok) return json(response, 422, { error: 'INVALID_RESUME', details: validation.errors })

    try {
      const pdf = await compile(validation.data)
      response.writeHead(200, {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="resume.pdf"',
        'content-length': pdf.length,
        'cache-control': 'no-store',
      })
      response.end(pdf)
    } catch (error) {
      const timeout = error instanceof Error && error.message === 'COMPILE_TIMEOUT'
      json(response, timeout ? 504 : 500, { error: timeout ? 'COMPILE_TIMEOUT' : 'COMPILE_FAILED' })
    }
  })
}

if (process.env.NODE_ENV !== 'test') {
  createResumeCompilerServer().listen(PORT, '0.0.0.0', () => {
    console.log(`Resume compiler listening on port ${PORT}`)
  })
}
