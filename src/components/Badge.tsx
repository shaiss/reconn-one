interface BadgeProps {
  label: string
  variant?: 'positive' | 'neutral' | 'danger' | 'funded' | 'muted'
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  positive: 'bg-brand-light text-brand border-brand-light',
  neutral: 'bg-surface-strong text-text-base border-surface-strong',
  danger: 'bg-danger text-white border-danger',
  funded: 'bg-brand text-white border-brand',
  muted: 'bg-surface-muted text-text-muted border-border',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border rounded ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}
