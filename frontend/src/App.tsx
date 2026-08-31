import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { analyzeResume, getAnalysisErrorMessage } from './analysis/analyzeResume'
import type { ResumeAnalysis } from './analysis/types'
import { ResultsDashboard } from './components/ResultsDashboard'
import { hasPdfSignature, validatePdf } from './fileValidation'
import { getExtractionErrorMessage } from './pdfExtractionErrors'

type ProcessState = 'idle' | 'checking' | 'extracting'

function formatFileSize(size: number) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`
}

function Brand() {
  return (
    <a className="brand" href="#main" aria-label="CGC Resume Check home">
      <span className="brand-mark" aria-hidden="true">CG</span>
      <span>Career Guidance Club</span>
    </a>
  )
}

function App() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [processState, setProcessState] = useState<ProcessState>('idle')

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
      <header className="site-header">
        <Brand />
        <span className="privacy-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 5.5 5.7v5.8c0 4.1 2.7 7.9 6.5 9.5 3.8-1.6 6.5-5.4 6.5-9.5V5.7L12 3Zm0 3.1 3.8 1.6v3.8c0 2.7-1.5 5.4-3.8 6.7-2.3-1.3-3.8-4-3.8-6.7V7.7L12 6.1Z" />
          </svg>
          Private by design
        </span>
      </header>

      <main id="main" className="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">Resume guidance for students</p>
          <h1 id="page-title">Turn your resume into a clearer career direction.</h1>
          <p className="intro-copy">
            Choose your PDF resume to discover your strongest skills, matching
            roles, and practical next steps—all inside your browser.
          </p>
        </section>

        <section className="upload-card" aria-labelledby="upload-title">
          <div className="card-heading">
            <div>
              <p className="step-label">Private resume check</p>
              <h2 id="upload-title">Choose your resume</h2>
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
        </section>

        <section className="expectations" aria-labelledby="expectations-title">
          <h2 id="expectations-title">What you’ll get</h2>
          <div className="expectation-grid">
            <article>
              <span>01</span>
              <h3>Readiness score</h3>
              <p>A simple view of how complete your current profile is.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Matching roles</h3>
              <p>Career paths that fit the skills already on your resume.</p>
            </article>
            <article>
              <span>03</span>
              <h3>90-day roadmap</h3>
              <p>Focused learning and project steps to strengthen your profile.</p>
            </article>
          </div>
        </section>
      </main>

      <footer>CGC provides learning guidance, not hiring predictions.</footer>
    </div>
  )
}

export default App
