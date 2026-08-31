import {
  hasPdfSignature,
  MAX_PDF_SIZE_BYTES,
  validatePdf,
} from './fileValidation'

describe('validatePdf', () => {
  it('rejects an empty PDF', () => {
    const file = new File([], 'empty.pdf', { type: 'application/pdf' })
    expect(validatePdf(file)).toMatch(/empty/i)
  })

  it('rejects a PDF larger than 10 MB', () => {
    const file = new File(['content'], 'large.pdf', { type: 'application/pdf' })
    Object.defineProperty(file, 'size', { value: MAX_PDF_SIZE_BYTES + 1 })
    expect(validatePdf(file)).toMatch(/larger than 10 MB/i)
  })

  it('recognises the PDF file signature', async () => {
    const file = new File(['%PDF-1.7 content'], 'resume.pdf', {
      type: 'application/pdf',
    })
    expect(await hasPdfSignature(file)).toBe(true)
  })

  it('allows a PDF with an omitted browser MIME type', () => {
    const file = new File(['%PDF-1.7 content'], 'resume.pdf')
    expect(validatePdf(file)).toBeNull()
  })
})
