interface ScoreBadgeProps {
  score: number
}

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const isPositive = score >= 80
  const classes = isPositive
    ? 'bg-score-positive-bg text-score-positive-text border-score-positive-border score-positive'
    : 'bg-score-neutral-bg text-score-neutral-text border-score-neutral-border score-neutral'

  return (
    <span
      className={`inline-flex items-center justify-center font-mono text-[11px] font-medium px-2 py-1 rounded border w-[48px] ${classes}`}
    >
      {score}
    </span>
  )
}
