import { createHmac } from 'node:crypto'

const MAX_BODY_BYTES = 64 * 1024
const REQUESTS_PER_MINUTE = 5
const requestWindows = new Map()

function clientAddress(request) {
  const forwarded = request.headers['x-forwarded-for']
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0])?.trim() || request.socket?.remoteAddress || 'unknown'
}

function isRateLimited(address) {
  const now = Date.now()
  const recent = (requestWindows.get(address) ?? []).filter((timestamp) => now - timestamp < 60_000)
  recent.push(now)
  requestWindows.set(address, recent)
  return recent.length > REQUESTS_PER_MINUTE
}

function sendJson(response, status, body) {
  response.setHeader('cache-control', 'no-store')
  return response.status(status).json(body)
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'METHOD_NOT_ALLOWED' })
  if (isRateLimited(clientAddress(request))) return sendJson(response, 429, { error: 'RATE_LIMITED' })

  const compilerUrl = process.env.COMPILER_URL
  const signingSecret = process.env.COMPILER_SIGNING_SECRET
  if (!compilerUrl || !signingSecret || signingSecret.length < 32) return sendJson(response, 503, { error: 'COMPILER_UNAVAILABLE' })

  const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body ?? {})
  if (Buffer.byteLength(body) > MAX_BODY_BYTES) return sendJson(response, 413, { error: 'PAYLOAD_TOO_LARGE' })
  const timestamp = String(Math.floor(Date.now() / 1000))
  const signature = createHmac('sha256', signingSecret).update(`${timestamp}.${body}`).digest('hex')

  try {
    const compilerResponse = await fetch(`${compilerUrl.replace(/\/$/, '')}/compile`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-cgc-timestamp': timestamp,
        'x-cgc-signature': signature,
      },
      body,
      signal: AbortSignal.timeout(18_000),
    })

    if (!compilerResponse.ok) {
      const error = await compilerResponse.json().catch(() => ({ error: 'COMPILER_FAILED' }))
      return sendJson(response, compilerResponse.status, error)
    }
    const pdf = Buffer.from(await compilerResponse.arrayBuffer())
    response.setHeader('content-type', 'application/pdf')
    response.setHeader('content-disposition', 'attachment; filename="resume.pdf"')
    response.setHeader('cache-control', 'no-store')
    response.setHeader('x-content-type-options', 'nosniff')
    return response.status(200).send(pdf)
  } catch {
    return sendJson(response, 503, { error: 'COMPILER_UNAVAILABLE' })
  }
}
