import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    window.location.hash = ''
    vi.mocked(extractPdfText).mockResolvedValue({
      text: extractedResume,
      pageCount: 1,
    })
    vi.stubGlobal('scrollTo', vi.fn())
  })

  it('shows curated resume resources on the separate templates page', () => {
    window.location.hash = '#templates'
    render(<App />)

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume check' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('link', { name: 'Build resume' })).toHaveAttribute('href', '#resume-builder')
    expect(screen.getByRole('link', { name: 'Curated resumes' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Start with a resume that is easy to read.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Jake's Resume" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Effective developer resume' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /build with this template/i })).toHaveAttribute(
      'href',
      '#resume-builder',
    )
    expect(screen.getByRole('link', { name: /open original template/i })).toHaveAttribute(
      'href',
      'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs',
    )
    expect(screen.getByRole('link', { name: /open original writing guide/i })).toHaveAttribute(
      'href',
      'https://stackoverflow.blog/2020/11/25/how-to-write-an-effective-developer-resume-advice-from-a-hiring-manager/',
    )
  })

  it('opens the Jake resume builder with every standard section', () => {
    window.location.hash = '#resume-builder'
    render(<App />)

    expect(screen.getByRole('heading', { name: /build a resume that is clear/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Technical skills' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Custom sections' })).toBeInTheDocument()
  })

  it('updates the live preview and supports custom sections', () => {
    window.location.hash = '#resume-builder'
    render(<App />)

    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: 'Asha Tigga' } })
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'asha@example.com' } })
    fireEvent.change(screen.getByLabelText('School or university'), { target: { value: 'CGC University' } })
    fireEvent.click(screen.getByRole('button', { name: /add custom section/i }))
    fireEvent.change(screen.getByLabelText('Section title'), { target: { value: 'Certifications' } })
    fireEvent.change(screen.getAllByLabelText('Bullet point 1')[2], { target: { value: 'AWS Cloud Practitioner' } })

    const preview = screen.getByRole('article', { name: 'Live resume preview' })
    expect(preview).toHaveTextContent('Asha Tigga')
    expect(preview).toHaveTextContent('asha@example.com')
    expect(preview).toHaveTextContent('CGC University')
    expect(preview).toHaveTextContent('Certifications')
    expect(preview).toHaveTextContent('AWS Cloud Practitioner')
  })

  it('validates the draft before requesting a PDF', () => {
    window.location.hash = '#resume-builder'
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Enter your full name')
  })

  it('generates and downloads a PDF for a complete draft without a server request', async () => {
    window.location.hash = '#resume-builder'
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:resume') })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<App />)

    fireEvent.change(screen.getByLabelText(/^Full name/), { target: { value: 'Asha Tigga' } })
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'asha@example.com' } })
    fireEvent.change(screen.getByLabelText('School or university'), { target: { value: 'CGC University' } })
    fireEvent.change(screen.getByLabelText('Degree and subject'), { target: { value: 'B.Tech in Computer Science' } })
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF' }))

    await waitFor(() => expect(URL.createObjectURL).toHaveBeenCalled())
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
    expect(
      screen.getByRole('img', { name: /Career-readiness score: \d+ out of 100/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Skill coverage by category: Software/ }),
    ).toBeInTheDocument()
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
