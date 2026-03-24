import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../components/Logo'

const steps = [
  { path: '/onboarding/step-1', label: 'Product Context', icon: 'analytics' },
  { path: '/onboarding/step-2', label: 'Target Personas', icon: 'group' },
  { path: '/onboarding/step-3', label: 'ICP Definition', icon: 'target' },
  { path: '/onboarding/step-4', label: 'Growth Goals', icon: 'trending_up' },
]

export function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Topnav */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-border shadow-sm">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-text-muted hover:text-brand cursor-pointer">help</span>
          <span className="material-symbols-outlined text-text-muted hover:text-brand cursor-pointer">notifications</span>
          <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-xs font-bold text-text-secondary">
            AE
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-surface-subtle border-r border-border hidden lg:flex flex-col p-6 gap-y-4">
          <div className="mb-6">
            <div className="text-xs font-black tracking-[0.2em] text-brand uppercase mb-1">Onboarding</div>
            <div className="text-sm text-text-muted font-medium">Setup Phase</div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            {steps.map((step) => (
              <NavLink
                key={step.path}
                to={step.path}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-3 px-4 py-3 bg-white text-brand rounded-lg shadow-sm border border-border font-semibold text-sm uppercase tracking-wide'
                    : 'flex items-center gap-3 px-4 py-3 text-text-muted hover:text-brand hover:bg-surface-muted rounded-lg transition-colors font-semibold text-sm uppercase tracking-wide'
                }
              >
                <span className="material-symbols-outlined text-xl">{step.icon}</span>
                <span>{step.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-border">
            <button className="w-full py-3 bg-brand text-white rounded-lg font-bold shadow-lg hover:bg-emerald-800 transition-all">
              Save Progress
            </button>
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-4rem)] p-8 lg:p-12 bg-surface-subtle">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
