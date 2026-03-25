export type SignalType =
  | 'exec-hire'
  | 'funding'
  | 'regulatory'
  | 'fleet-expansion'
  | 'tech-stack'
  | 'competitor'
  | 'risk'
  | 'generic'

const signalConfig: Record<SignalType, { label: string; classes: string; icon: string }> = {
  'exec-hire':       { label: 'Exec Hire',      classes: 'bg-brand-light text-brand border-brand-light',                                    icon: 'person_add' },
  'funding':         { label: 'Funding',         classes: 'bg-score-positive-bg text-score-positive-text border-score-positive-border',       icon: 'payments' },
  'regulatory':      { label: 'Regulatory',      classes: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',                                    icon: 'gavel' },
  'fleet-expansion': { label: 'Fleet Expansion', classes: 'bg-brand-light text-brand border-brand-light',                                    icon: 'electric_car' },
  'tech-stack':      { label: 'Tech Stack',      classes: 'bg-surface-muted text-text-secondary border-border',                              icon: 'language' },
  'competitor':      { label: 'Competitor',      classes: 'bg-surface-muted text-text-secondary border-border',                              icon: 'compare_arrows' },
  'risk':            { label: 'Risk Alert',      classes: 'bg-danger-light text-danger border-danger-light',                                  icon: 'trending_down' },
  'generic':         { label: 'Signal',          classes: 'bg-surface-muted text-text-muted border-border',                                  icon: 'sensors' },
}

interface SignalBadgeProps {
  type: SignalType
  label?: string
}

export function SignalBadge({ type, label }: SignalBadgeProps) {
  const config = signalConfig[type]
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium border rounded ${config.classes}`}
    >
      <span className="material-symbols-outlined text-[12px]">{config.icon}</span>
      {label ?? config.label}
    </span>
  )
}
