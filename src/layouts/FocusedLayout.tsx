import { Outlet, useNavigate, useLocation } from 'react-router-dom'

export function FocusedLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathParts = location.pathname.split('/').filter(Boolean)
  const screenLabel = pathParts[1] === 'dossier' ? 'Deal-Ready Dossier' : 'Decision Maker Map'
  const accountId = pathParts[2] ?? ''
  const accountLabel = accountId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <div className="min-h-screen bg-surface-subtle flex flex-col">
      <header className="h-12 bg-white border-b border-border flex items-center px-4 shrink-0 z-50">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-muted hover:text-text-base transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <div className="h-4 w-px bg-border mx-4" />
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-text-base text-sm">{accountLabel}</span>
          <span className="text-text-muted text-sm">/</span>
          <span className="text-text-base text-sm font-medium">{screenLabel}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
