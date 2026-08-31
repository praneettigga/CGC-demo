import { beforeEach, describe, expect, it, vi } from 'vitest'
import handler from './resume-pdf.mjs'

function responseRecorder() {
  return {
    headers: {},
    statusCode: 200,
    body: undefined,
    setHeader(name, value) { this.headers[name] = value },
    status(code) { this.statusCode = code; return this },
    json(body) { this.body = body; return this },
    send(body) { this.body = body; return this },
  }
}

describe('resume PDF proxy', () => {
  beforeEach(() => {
    process.env.COMPILER_URL = 'https://compiler.example.com'
    process.env.COMPILER_SIGNING_SECRET = 'test-secret-with-at-least-32-characters'
  })

  it('signs, forwards, and returns the compiler PDF', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(new Blob(['%PDF']), {
      status: 200,
      headers: { 'content-type': 'application/pdf' },
    }))
    vi.stubGlobal('fetch', fetchMock)
    const request = { method: 'POST', headers: { 'x-forwarded-for': '192.0.2.10' }, body: { contact: { fullName: 'Asha' } }, socket: {} }
    const response = responseRecorder()

    await handler(request, response)

    expect(response.statusCode).toBe(200)
    expect(response.headers['content-type']).toBe('application/pdf')
    expect(fetchMock).toHaveBeenCalledWith('https://compiler.example.com/compile', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ 'x-cgc-signature': expect.any(String) }),
    }))
  })

  it('fails closed when compiler configuration is missing', async () => {
    delete process.env.COMPILER_URL
    const response = responseRecorder()
    await handler({ method: 'POST', headers: { 'x-forwarded-for': '192.0.2.11' }, body: {}, socket: {} }, response)
    expect(response.statusCode).toBe(503)
    expect(response.body).toEqual({ error: 'COMPILER_UNAVAILABLE' })
  })
})
