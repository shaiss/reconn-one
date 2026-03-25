import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'

const navItems: {
  path: string
  label: string
  icon: string
  /** When set, item is active for any path starting with this prefix (for :accountId routes). */
  activePathPrefix?: string
}[] = [
  { path: '/crm/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/crm/dossier/greencharge', label: 'Dossier', icon: 'description', activePathPrefix: '/crm/dossier' },
  { path: '/crm/map/greencharge', label: 'Decision Map', icon: 'account_tree', activePathPrefix: '/crm/map' },
  { path: '/crm/feed', label: 'Intelligence', icon: 'sensors' },
  { path: '/crm/accounts', label: 'Accounts', icon: 'analytics' },
  { path: '/crm/deals', label: 'Deals', icon: 'handshake' },
  { path: '/crm/settings', label: 'Integrations', icon: 'settings_input_component' },
]

export function CRMLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-surface-subtle border-r border-border w-64">
        <div className="p-6">
          <Logo size="sm" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-text-muted mt-2">EV Charging Division</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                (item.activePathPrefix
                  ? location.pathname.startsWith(item.activePathPrefix)
                  : isActive)
                  ? 'flex items-center gap-3 bg-brand text-white px-4 py-3 text-xs uppercase tracking-widest font-bold'
                  : 'flex items-center gap-3 text-text-secondary px-4 py-3 hover:bg-surface-strong transition-all text-xs uppercase tracking-widest font-bold'
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded bg-brand-light flex items-center justify-center text-brand font-bold text-xs">
              RM
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-base truncate">Ray McSpirit</p>
              <p className="text-[9px] text-text-muted">Admin Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 min-h-screen flex flex-col">
        {/* Topnav */}
        <header className="flex justify-between items-center w-full px-6 h-16 shrink-0 sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold tracking-tight text-brand font-heading md:hidden">RECONN.ONE</span>
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
              <input
                className="pl-10 pr-4 py-1.5 bg-surface-subtle border border-border rounded text-sm focus:ring-1 focus:ring-brand focus:border-brand w-72 outline-none"
                placeholder="Search accounts, deals..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-text-muted hover:bg-surface-subtle transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <NavLink
              to="/crm/settings"
              aria-label="Settings"
              className={({ isActive }) =>
                `p-2 rounded transition-colors ${isActive ? 'bg-surface-subtle text-brand' : 'text-text-muted hover:bg-surface-subtle'}`
              }
            >
              <span className="material-symbols-outlined">settings</span>
            </NavLink>
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xs border border-border">
              RM
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
