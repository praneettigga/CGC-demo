import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'

describe('resume upload screen', () => {
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
})
