import { useEffect, useRef } from 'react'

export function LandingHero() {
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    const canTilt = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: fine)').matches
    if (!scene || !canTilt) return

    let animationFrame = 0

    const handlePointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const bounds = scene.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5
        scene.style.setProperty('--scene-rotate-x', `${(-y * 8).toFixed(2)}deg`)
        scene.style.setProperty('--scene-rotate-y', `${(x * 10).toFixed(2)}deg`)
        scene.style.setProperty('--scene-shift-x', `${(x * 10).toFixed(2)}px`)
        scene.style.setProperty('--scene-shift-y', `${(y * 8).toFixed(2)}px`)
      })
    }

    const resetTilt = () => {
      cancelAnimationFrame(animationFrame)
      scene.style.setProperty('--scene-rotate-x', '0deg')
      scene.style.setProperty('--scene-rotate-y', '0deg')
      scene.style.setProperty('--scene-shift-x', '0px')
      scene.style.setProperty('--scene-shift-y', '0px')
    }

    scene.addEventListener('pointermove', handlePointerMove)
    scene.addEventListener('pointerleave', resetTilt)
    return () => {
      cancelAnimationFrame(animationFrame)
      scene.removeEventListener('pointermove', handlePointerMove)
      scene.removeEventListener('pointerleave', resetTilt)
    }
  }, [])

  return (
    <section className="landing-hero" aria-labelledby="page-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          <span aria-hidden="true">✦</span> private career guidance for students
        </p>
        <h1 id="page-title">
          your resume,{' '}
          <span>finally talking.</span>
        </h1>
        <p className="hero-description">
          See the skills, roles, and next steps already hiding in your resume.
          No sign-in. No saving. Just a clearer direction.
        </p>
        <div className="hero-actions">
          <a className="paper-button paper-button--primary" href="#resume-checker">
            check my resume <span aria-hidden="true">↘</span>
          </a>
          <a className="text-link" href="#resume-builder">
            or build one first <span aria-hidden="true">→</span>
          </a>
        </div>
        <p className="hero-whisper">
          <span aria-hidden="true">⌁</span> your PDF never leaves this device
        </p>
      </div>

      <div className="hero-scene-wrap" aria-hidden="true">
        <p className="scene-note scene-note--top">look, your skills!</p>
        <svg className="scene-arrow" viewBox="0 0 110 70">
          <path d="M5 8c33 0 59 12 74 34 6 9 9 17 10 24m-11-8 11 8 7-12" />
        </svg>
        <div className="hero-scene" ref={sceneRef}>
          <div className="scene-shadow" />
          <div className="paper-folder">
            <span>career notes</span>
          </div>
          <div className="resume-sheet resume-sheet--back">
            <span className="sheet-line sheet-line--short" />
            <span className="sheet-line" />
            <span className="sheet-line sheet-line--medium" />
          </div>
          <div className="resume-sheet resume-sheet--main">
            <div className="resume-pin">CG</div>
            <p className="resume-name">ALEX MORGAN</p>
            <p className="resume-role">engineering student · builder · curious human</p>
            <div className="resume-rule" />
            <p className="resume-section-label">SKILLS FOUND</p>
            <div className="resume-tags">
              <span>React</span><span>Python</span><span>SQL</span><span>Git</span>
            </div>
            <p className="resume-section-label">STRONGEST MATCH</p>
            <div className="resume-match">
              <span>frontend engineer</span>
              <strong>84%</strong>
            </div>
            <div className="resume-progress"><span /></div>
            <div className="resume-footer-line"><span /><span /></div>
          </div>
          <div className="score-sticker">
            <small>ready?</small>
            <strong>78</strong>
            <span>/100</span>
          </div>
          <div className="spark-sticker spark-sticker--blue">✦</div>
          <div className="spark-sticker spark-sticker--pink">♥</div>
          <div className="smile-sticker">:)</div>
        </div>
        <p className="scene-note scene-note--bottom">all in your browser</p>
      </div>
    </section>
  )
}
