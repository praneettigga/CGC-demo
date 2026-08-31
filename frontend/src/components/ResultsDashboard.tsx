import type { CSSProperties } from 'react'
import type { ResumeAnalysis } from '../analysis/types'
import { SkillRadar } from './SkillRadar'

interface ResultsDashboardProps {
  analysis: ResumeAnalysis
  fileName: string
  onReset: () => void
}

export function ResultsDashboard({
  analysis,
  fileName,
  onReset,
}: ResultsDashboardProps) {
  const scoreStyle = { '--score': `${analysis.score * 3.6}deg` } as CSSProperties

  return (
    <div className="app-shell dashboard-shell">
      <header className="site-header dashboard-header">
        <a className="brand" href="#dashboard-main" aria-label="CGC dashboard home">
          <span className="brand-mark" aria-hidden="true">CG</span>
          <span>Career Guidance Club</span>
        </a>
        <div className="dashboard-actions">
          <a className="templates-nav-link" href="#templates">Resume templates</a>
          <button className="secondary-button" type="button" onClick={onReset}>
            Analyse another resume
          </button>
        </div>
      </header>

      <main id="dashboard-main" className="dashboard-main">
        <section className="dashboard-intro">
          <div>
            <p className="eyebrow">Your private resume report</p>
            <h1>Your career readiness dashboard</h1>
            <p className="dashboard-file" title={fileName}>{fileName}</p>
          </div>
          <p className="fit-note">Role matches show profile fit, not hiring probability.</p>
        </section>

        <section className="score-card dashboard-card" aria-labelledby="score-title">
          <div
            className="score-ring"
            style={scoreStyle}
            role="img"
            aria-label={`Career-readiness score: ${analysis.score} out of 100`}
          >
            <div>
              <strong>{analysis.score}</strong>
              <span>out of 100</span>
            </div>
          </div>
          <div className="score-copy">
            <p className="section-kicker">Career-readiness score</p>
            <h2 id="score-title">
              {analysis.score >= 75
                ? 'Strong foundation'
                : analysis.score >= 45
                  ? 'Promising start'
                  : 'Early foundation'}
            </h2>
            <p>{analysis.explanation}</p>
            <div className="signal-list" aria-label="Resume sections found">
              <span
                className={analysis.signals.hasProjects ? 'found' : ''}
                aria-label={`Projects ${analysis.signals.hasProjects ? 'found' : 'not found'}`}
              >Projects</span>
              <span
                className={analysis.signals.hasExperience ? 'found' : ''}
                aria-label={`Experience ${analysis.signals.hasExperience ? 'found' : 'not found'}`}
              >Experience</span>
              <span
                className={analysis.signals.hasEducation ? 'found' : ''}
                aria-label={`Education ${analysis.signals.hasEducation ? 'found' : 'not found'}`}
              >Education</span>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-card skills-card" aria-labelledby="skill-map-title">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Your skill map</p>
                <h2 id="skill-map-title">Coverage by area</h2>
              </div>
            </div>
            <SkillRadar scores={analysis.categoryScores} />
          </section>

          <section className="dashboard-card" aria-labelledby="strongest-title">
            <p className="section-kicker">Skills recognised</p>
            <h2 id="strongest-title">Your strongest signals</h2>
            <div className="skill-chip-list">
              {analysis.strongestSkills.map((skill) => (
                <span key={skill.id}>{skill.name}</span>
              ))}
            </div>
            <div className="recommendation-box">
              <h3>Focus on next</h3>
              {analysis.recommendedSkills.length ? (
                <ul>
                  {analysis.recommendedSkills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              ) : (
                <p>Deepen one advanced skill in your strongest area.</p>
              )}
            </div>
          </section>
        </div>

        <section className="dashboard-section" aria-labelledby="roles-title">
          <div className="section-heading roles-heading">
            <div>
              <p className="section-kicker">Top profile fits</p>
              <h2 id="roles-title">Roles matching your resume</h2>
            </div>
            <p>Based only on skills found in this PDF.</p>
          </div>
          <div className="role-grid">
            {analysis.roleMatches.map((role, index) => (
              <article className="role-card" key={role.id}>
                <div className="role-topline">
                  <span>#{index + 1}</span>
                  <strong>{role.matchPercentage}% match</strong>
                </div>
                <h3>{role.name}</h3>
                <p>{role.description}</p>
                <div className="match-bar" aria-hidden="true">
                  <span style={{ width: `${role.matchPercentage}%` }} />
                </div>
                <div className="role-skills">
                  <span>Matched: {role.matchedSkills.join(', ') || 'No core skills yet'}</span>
                  <span>Build next: {role.missingSkills.slice(0, 3).join(', ') || 'Advanced depth'}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section roadmap-section" aria-labelledby="roadmap-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Practical next steps</p>
              <h2 id="roadmap-title">Your 90-day roadmap</h2>
            </div>
          </div>
          <ol className="roadmap-list">
            {analysis.roadmap.map((step, index) => (
              <li key={step.period}>
                <div className="roadmap-number">{index + 1}</div>
                <div>
                  <span>{step.period}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="dashboard-disclaimer">
          <strong>Keep this result in context.</strong>
          <p>
            CGC uses a reviewed, versioned engineering skill list for learning
            guidance. It does not assess your potential, make hiring decisions,
            or save this report.
          </p>
          <button className="secondary-button" type="button" onClick={onReset}>
            Analyse another resume
          </button>
        </section>
      </main>

      <footer>Nothing from this report is saved. Refreshing clears it.</footer>
    </div>
  )
}
