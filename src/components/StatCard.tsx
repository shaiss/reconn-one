interface StatCardProps {
  label: string
  value: string
  trend?: string
  trendPositive?: boolean
}

export function StatCard({ label, value, trend, trendPositive }: StatCardProps) {
  return (
    <div className="bg-surface border border-border p-6 flex flex-col gap-2">
      <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
        {label}
      </h3>
      <div className="font-heading text-4xl font-semibold text-brand tracking-tight">
        {value}
      </div>
      {trend && (
        <p className="text-[12px] text-text-muted flex items-center gap-1 mt-1">
          {trendPositive && (
            <span className="material-symbols-outlined text-[14px] text-brand-muted">
              trending_up
            </span>
          )}
          {trend}
        </p>
      )}
    </div>
  )
}
