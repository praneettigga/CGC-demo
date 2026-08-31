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
  return (
    <header className={`site-header${compact ? ' site-header--compact' : ''}`}>
      <a className="brand" href="#main" aria-label="Career Guidance Club home" onClick={onResumeCheck}>
        <span className="brand-mark" aria-hidden="true">CG</span>
        <span>Career Guidance Club</span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            className="site-nav-link"
            href={item.href}
            key={item.page}
            aria-current={activePage === item.page ? 'page' : undefined}
            onClick={item.page === 'check' ? onResumeCheck : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
