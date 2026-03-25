import { type ReactNode } from 'react'

interface SectionPanelProps {
  title?: string
  headerRight?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionPanel({ title, headerRight, children, className = '' }: SectionPanelProps) {
  return (
    <div className={`bg-surface border border-border flex flex-col ${className}`}>
      {title && (
        <div className="border-b border-border px-4 py-3 flex justify-between items-center bg-surface-muted">
          <h3 className="font-heading font-semibold text-text-base">{title}</h3>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
