import { useEffect, useRef, useState } from 'react'

type AppPage = 'check' | 'builder' | 'templates'

interface SiteHeaderProps {
  activePage: AppPage
  compact?: boolean
  onResumeCheck?: () => void
}

const navItems: Array<{ href: string; label: string; page: AppPage }> = [
  { href: '#main', label: 'Resume check', page: 'check' },
  { href: '#resume-builder', label: 'Build resume', page: 'builder' },
  { href: '#templates', label: 'Curated resumes', page: 'templates' },
]

export function SiteHeader({ activePage, compact = false, onResumeCheck }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className={`site-header${compact ? ' site-header--compact' : ''}${menuOpen ? ' menu-open' : ''}`}
    >
      <a
        className="brand"
        href="#main"
        aria-label="Career Guidance Club home"
        onClick={() => {
          setMenuOpen(false)
          onResumeCheck?.()
        }}
      >
        <span className="brand-mark" aria-hidden="true">CG</span>
        <span>Career Guidance Club</span>
      </a>
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav id="main-navigation" className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            className="site-nav-link"
            href={item.href}
            key={item.page}
            aria-current={activePage === item.page ? 'page' : undefined}
            onClick={() => {
              setMenuOpen(false)
              if (item.page === 'check') onResumeCheck?.()
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
