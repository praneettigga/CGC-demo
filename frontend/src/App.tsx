import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { analyzeResume, getAnalysisErrorMessage } from './analysis/analyzeResume'
import type { ResumeAnalysis } from './analysis/types'
import { ResumeBuilderPage } from './components/ResumeBuilderPage'
import { LandingHero } from './components/LandingHero'
import { ResultsDashboard } from './components/ResultsDashboard'
import { ResumeTemplatesPage } from './components/ResumeTemplatesPage'
import { SiteHeader } from './components/SiteHeader'
import { hasPdfSignature, validatePdf } from './fileValidation'
import { getExtractionErrorMessage } from './pdfExtractionErrors'

type ProcessState = 'idle' | 'checking' | 'extracting'

function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

function App() {
  const [page, setPage] = useState(() => {
    if (window.location.hash === '#templates') return 'templates'
    if (window.location.hash === '#resume-builder') return 'builder'
    return 'check'
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [processState, setProcessState] = useState<ProcessState>('idle')

  useEffect(() => {
    const updatePage = () => {
      if (window.location.hash === '#templates') setPage('templates')
      else if (window.location.hash === '#resume-builder') setPage('builder')
      else setPage('check')
    }
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  useEffect(() => {
    if (page !== 'check') return

    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14 },
    )

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [page])

  function showResumeCheck() {
    window.location.hash = '#main'
    setPage('check')
  }

  function resetResume() {
    setSelectedFile(null)
    setResumeText('')
    setAnalysis(null)
    setError('')
    setProcessState('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function chooseFile(file?: File) {
    setError('')
    setSelectedFile(null)
    setResumeText('')
    setAnalysis(null)

    if (!file) return

    const validationError = validatePdf(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setProcessState('checking')
    try {
      if (!(await hasPdfSignature(file))) {
        setError('This file does not appear to be a valid PDF.')
        return
      }

      setSelectedFile(file)
    } catch {
      setError('This PDF could not be checked. Please choose another file.')
    } finally {
      setProcessState('idle')
    }
  }

  async function handleAnalyse() {
    if (!selectedFile) return

    setError('')
    setProcessState('extracting')
    try {
      const { extractPdfText } = await import('./pdfExtraction')
      const extracted = await extractPdfText(selectedFile)
      setResumeText(extracted.text)
      setAnalysis(analyzeResume(extracted.text))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (caughtError) {
      const isAnalysisError =
        caughtError instanceof Error &&
        caughtError.message === 'NO_RECOGNISED_SKILLS'
      setError(
        isAnalysisError
          ? getAnalysisErrorMessage(caughtError)
          : getExtractionErrorMessage(caughtError),
      )
    } finally {
      setProcessState('idle')
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void chooseFile(event.target.files?.[0])
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)
    void chooseFile(event.dataTransfer.files?.[0])
  }

  if (page === 'templates') {
    return <ResumeTemplatesPage />
  }

  if (page === 'builder') {
    return <ResumeBuilderPage />
  }

  if (analysis && selectedFile && resumeText) {
    return (
      <ResultsDashboard
        analysis={analysis}
        fileName={selectedFile.name}
        onReset={resetResume}
      />
    )
  }

  const isBusy = processState !== 'idle'

  return (
    <div className="app-shell">
      <SiteHeader activePage="check" onResumeCheck={showResumeCheck} />

      <main id="main" className="main-content">
        <LandingHero />

        <section className="promise-strip" aria-label="How CGC works" data-reveal>
          <p><span>01</span> choose a PDF</p>
          <span className="promise-arrow" aria-hidden="true">→</span>
          <p><span>02</span> read in your browser</p>
          <span className="promise-arrow" aria-hidden="true">→</span>
          <p><span>03</span> get a clear roadmap</p>
        </section>

        <section id="resume-checker" className="upload-section" aria-labelledby="upload-title" data-reveal>
          <div className="upload-intro">
            <p className="handwritten-note">okay, let’s have a look</p>
            <h2 id="upload-title">drop in your resume.</h2>
            <p>The browser reads it here, finds the useful signals, and clears everything when you leave.</p>
          </div>

          <div className="upload-card">
          <div className="card-heading">
            <div>
              <p className="step-label">Private resume check</p>
              <h3>Choose your resume</h3>
            </div>
            <span className="file-rule">PDF · Max 10 MB</span>
          </div>

          <div
            className={`drop-zone${isDragging ? ' is-dragging' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 3a1 1 0 0 1 .7.3l4 4a1 1 0 0 1-1.4 1.4L13 6.4V15a1 1 0 1 1-2 0V6.4L8.7 8.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 12 3ZM5 14a1 1 0 0 1 1 1v4h12v-4a1 1 0 1 1 2 0v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a1 1 0 0 1 1-1Z" />
              </svg>
            </div>
            <p className="drop-title">Drop your resume here</p>
            <p className="drop-copy">or choose it from your device</p>
            <button
              className="choose-button"
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isBusy}
            >
              Choose PDF
            </button>
            <input
              ref={inputRef}
              className="visually-hidden"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleInputChange}
              aria-label="Choose PDF resume"
              disabled={isBusy}
            />
          </div>

          <div className="status-area" aria-live="polite">
            {processState === 'checking' && (
              <div className="status-message checking-message" role="status">
                <span className="spinner" aria-hidden="true" />
                <p>Checking your PDF…</p>
              </div>
            )}

            {processState === 'extracting' && (
              <div className="status-message checking-message" role="status">
                <span className="spinner" aria-hidden="true" />
                <p>Reading and analysing your resume…</p>
              </div>
            )}

            {error && (
              <div className="status-message error-message" role="alert">
                <span aria-hidden="true">!</span>
                <p>{error}</p>
              </div>
            )}

            {selectedFile && (
              <div className="selected-file-wrap">
                <div className="selected-file">
                  <div className="file-icon" aria-hidden="true">PDF</div>
                  <div className="file-details">
                    <strong>{selectedFile.name}</strong>
                    <span>{formatFileSize(selectedFile.size)} · Ready for analysis</span>
                  </div>
                  <button
                    className="remove-button"
                    type="button"
                    onClick={resetResume}
                    aria-label={`Remove ${selectedFile.name}`}
                    disabled={isBusy}
                  >
                    Remove
                  </button>
                </div>
                <button
                  className="analyse-button"
                  type="button"
                  onClick={() => void handleAnalyse()}
                  disabled={isBusy}
                >
                  {processState === 'extracting' ? 'Analysing…' : 'Analyse resume'}
                </button>
              </div>
            )}
          </div>

          <div className="privacy-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2 0h6V8a3 3 0 0 0-6 0v2Zm3 4a1.5 1.5 0 0 0-1 2.6V18a1 1 0 1 0 2 0v-1.4a1.5 1.5 0 0 0-1-2.6Z" />
            </svg>
            <p>
              <strong>Your resume stays private.</strong> It never leaves this
              device and is cleared when you refresh or close the page.
            </p>
          </div>
          </div>
        </section>

        <section className="expectations" aria-labelledby="expectations-title" data-reveal>
          <div className="section-title-row">
            <div>
              <p className="handwritten-note">the useful bits</p>
              <h2 id="expectations-title">what you’ll get.</h2>
            </div>
            <p>No mystery scores. Every result points back to what is actually written in your PDF.</p>
          </div>
          <div className="expectation-grid">
            <article>
              <span className="expectation-number">01</span>
              <span className="expectation-doodle" aria-hidden="true">◎</span>
              <h3>Readiness score</h3>
              <p>A simple view of how complete your current profile is.</p>
            </article>
            <article>
              <span className="expectation-number">02</span>
              <span className="expectation-doodle" aria-hidden="true">↗</span>
              <h3>Matching roles</h3>
              <p>Career paths that fit the skills already on your resume.</p>
            </article>
            <article>
              <span className="expectation-number">03</span>
              <span className="expectation-doodle" aria-hidden="true">✦</span>
              <h3>90-day roadmap</h3>
              <p>Focused learning and project steps to strengthen your profile.</p>
            </article>
          </div>
        </section>

        <section className="next-step-band" aria-labelledby="next-step-title" data-reveal>
          <div>
            <p className="handwritten-note">need a stronger starting point?</p>
            <h2 id="next-step-title">make the resume you wish you had.</h2>
          </div>
          <div className="next-step-actions">
            <a className="paper-button" href="#resume-builder">build a resume <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#templates">browse good examples <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <footer className="brand-footer">
        <strong>clearer resumes. calmer career choices.</strong>
        <span>CGC provides learning guidance, not hiring predictions.</span>
      </footer>
    </div>
  )
}

export default App
