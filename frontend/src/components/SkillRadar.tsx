import { categoryLabels } from '../data/careerData'
import type { CategoryScore } from '../analysis/types'

interface SkillRadarProps {
  scores: CategoryScore[]
}

function pointAt(index: number, radius: number, count: number) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2
  return {
    x: 150 + Math.cos(angle) * radius,
    y: 150 + Math.sin(angle) * radius,
  }
}

function polygonPoints(radius: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const point = pointAt(index, radius, count)
    return `${point.x},${point.y}`
  }).join(' ')
}

export function SkillRadar({ scores }: SkillRadarProps) {
  const categoryCount = scores.length
  const accessibleSummary = scores
    .map((item) => `${categoryLabels[item.category]} ${item.score} percent`)
    .join(', ')
  const scorePoints = scores
    .map((item, index) => {
      const point = pointAt(index, 92 * (item.score / 100), categoryCount)
      return `${point.x},${point.y}`
    })
    .join(' ')

  return (
    <div className="radar-wrap">
      <svg
        className="radar-chart"
        viewBox="0 0 300 300"
        role="img"
        aria-label={`Skill coverage by category: ${accessibleSummary}`}
      >
        {[31, 61, 92].map((radius) => (
          <polygon key={radius} points={polygonPoints(radius, categoryCount)} className="radar-grid" />
        ))}
        {Array.from({ length: categoryCount }, (_, index) => {
          const point = pointAt(index, 92, categoryCount)
          return (
            <line
              key={index}
              x1="150"
              y1="150"
              x2={point.x}
              y2={point.y}
              className="radar-line"
            />
          )
        })}
        <polygon points={scorePoints} className="radar-result" />
        {scores.map((item, index) => {
          const point = pointAt(index, 119, categoryCount)
          return (
            <text
              key={item.category}
              x={point.x}
              y={point.y}
              className="radar-label"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {categoryLabels[item.category]}
            </text>
          )
        })}
      </svg>
      <div className="radar-legend" aria-hidden="true">
        {scores.map((item) => (
          <span key={item.category}>
            {categoryLabels[item.category]} <strong>{item.score}%</strong>
          </span>
        ))}
      </div>
    </div>
  )
}
