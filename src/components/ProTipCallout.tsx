interface ProTipCalloutProps {
  title?: string
  body: string
  icon?: string
}

export function ProTipCallout({ title = 'Pro Tip', body, icon = 'lightbulb' }: ProTipCalloutProps) {
  return (
    <div className="bg-surface-muted rounded-xl p-6 relative overflow-hidden border border-border">
      <span
        className="material-symbols-outlined absolute -right-4 -bottom-4 text-7xl text-slate-200 rotate-12 select-none"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-widest text-brand mb-2">{title}</p>
        <p className="text-sm text-text-muted leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
