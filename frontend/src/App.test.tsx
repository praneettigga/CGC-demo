import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, vi } from 'vitest'
import App from './App'
import { extractPdfText } from './pdfExtraction'

vi.mock('./pdfExtraction', () => ({
  extractPdfText: vi.fn(),
}))

const extractedResume = `
  Bachelor of Technology
  Skills: JavaScript, React, HTML, CSS, Git, Node.js, SQL, Docker
  Projects: Built a student portal.
  Experience: Frontend internship.
`

describe('resume upload screen', () => {
  beforeEach(() => {
    vi.mocked(extractPdfText).mockResolvedValue({
      text: extractedResume,
      pageCount: 1,
    })
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('accepts a valid PDF', async () => {
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['%PDF-1.4 resume content'], 'student-resume.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [file] } })

    expect(await screen.findByText('student-resume.pdf')).toBeInTheDocument()
    expect(screen.getByText(/Ready for analysis/)).toBeInTheDocument()
  })

  it('rejects a non-PDF file', () => {
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['resume content'], 'student-resume.txt', {
      type: 'text/plain',
    })

    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please choose a PDF file.',
    )
    expect(screen.queryByText('student-resume.txt')).not.toBeInTheDocument()
  })

  it('rejects a renamed file without a PDF signature', async () => {
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['plain text'], 'renamed.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [file] } })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'does not appear to be a valid PDF',
    )
  })

  it('lets the student remove a selected PDF', async () => {
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['%PDF-1.4 resume content'], 'student-resume.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [file] } })
    await screen.findByText('student-resume.pdf')
    fireEvent.click(screen.getByRole('button', { name: /remove student-resume/i }))

    expect(screen.queryByText('student-resume.pdf')).not.toBeInTheDocument()
  })

  it('shows the complete dashboard after analysing a valid PDF', async () => {
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['%PDF-1.4 resume content'], 'student-resume.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(await screen.findByRole('button', { name: 'Analyse resume' }))

    expect(
      await screen.findByRole('heading', { name: 'Your career readiness dashboard' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Roles matching your resume' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your 90-day roadmap' })).toBeInTheDocument()
    expect(screen.getByText('student-resume.pdf')).toBeInTheDocument()
  })

  it('clears the result when analysing another resume', async () => {
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['%PDF-1.4 resume content'], 'student-resume.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(await screen.findByRole('button', { name: 'Analyse resume' }))
    await screen.findByRole('heading', { name: 'Your career readiness dashboard' })
    fireEvent.click(screen.getAllByRole('button', { name: 'Analyse another resume' })[0])

    expect(screen.getByRole('heading', { name: 'Choose your resume' })).toBeInTheDocument()
    expect(screen.queryByText('student-resume.pdf')).not.toBeInTheDocument()
  })

  it('shows an extraction error and allows retrying', async () => {
    vi.mocked(extractPdfText).mockRejectedValueOnce(new Error('broken data'))
    render(<App />)
    const input = screen.getByLabelText('Choose PDF resume')
    const file = new File(['%PDF-1.4 broken'], 'broken.pdf', {
      type: 'application/pdf',
    })

    fireEvent.change(input, { target: { files: [file] } })
    fireEvent.click(await screen.findByRole('button', { name: 'Analyse resume' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not read/i)
    expect(screen.getByRole('button', { name: 'Analyse resume' })).toBeEnabled()
  })
})
