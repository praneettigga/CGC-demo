import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import test from 'node:test'
import { createResumeCompilerServer } from '../src/server.mjs'
import { validResume } from './fixture.mjs'

const secret = 'test-signing-secret-with-enough-entropy'

async function startServer(compile = async () => Buffer.from('%PDF-test')) {
  const server = createResumeCompilerServer({ signingSecret: secret, compile })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  return { server, url: `http://127.0.0.1:${address.port}` }
}

function signedHeaders(body) {
  const timestamp = String(Math.floor(Date.now() / 1000))
  return {
    'content-type': 'application/json',
    'x-cgc-timestamp': timestamp,
    'x-cgc-signature': createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex'),
  }
}

test('returns health without exposing configuration', async (context) => {
  const { server, url } = await startServer()
  context.after(() => server.close())
  const response = await fetch(`${url}/health`)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

test('rejects unsigned compiler requests', async (context) => {
  const { server, url } = await startServer()
  context.after(() => server.close())
  const response = await fetch(`${url}/compile`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validResume) })
  assert.equal(response.status, 401)
})

test('returns the generated PDF for a valid signed request', async (context) => {
  const { server, url } = await startServer()
  context.after(() => server.close())
  const body = JSON.stringify(validResume)
  const response = await fetch(`${url}/compile`, { method: 'POST', headers: signedHeaders(body), body })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'application/pdf')
  assert.equal(Buffer.from(await response.arrayBuffer()).toString(), '%PDF-test')
})

test('does not invoke the compiler for invalid resume data', async (context) => {
  let called = false
  const { server, url } = await startServer(async () => { called = true; return Buffer.from('') })
  context.after(() => server.close())
  const body = JSON.stringify({})
  const response = await fetch(`${url}/compile`, { method: 'POST', headers: signedHeaders(body), body })
  assert.equal(response.status, 422)
  assert.equal(called, false)
})

test('rejects payloads larger than the service limit', async (context) => {
  const { server, url } = await startServer()
  context.after(() => server.close())
  const body = JSON.stringify({ padding: 'x'.repeat(70 * 1024) })
  const response = await fetch(`${url}/compile`, { method: 'POST', headers: signedHeaders(body), body })
  assert.equal(response.status, 413)
  assert.deepEqual(await response.json(), { error: 'BODY_TOO_LARGE' })
})

test('returns a safe timeout without exposing compiler output', async (context) => {
  const { server, url } = await startServer(async () => { throw new Error('COMPILE_TIMEOUT') })
  context.after(() => server.close())
  const body = JSON.stringify(validResume)
  const response = await fetch(`${url}/compile`, { method: 'POST', headers: signedHeaders(body), body })
  assert.equal(response.status, 504)
  assert.deepEqual(await response.json(), { error: 'COMPILE_TIMEOUT' })
})
