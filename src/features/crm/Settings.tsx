import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { Switch } from '@/components/ui/switch'
import { checkAllSources, type ApiHealthResult } from '@/lib/api/index.ts'

type Integration = {
  id: string
  name: string
  description: string
  icon: string
  defaultEnabled: boolean
  /** Maps to the `source` field returned by the health check. */
  healthSource: string
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'nrel',
    name: 'NREL / AFDC',
    description: 'Alternative Fuels Data Center — EV station locations, gap analysis, and NEVI corridor data.',
    icon: 'ev_station',
    defaultEnabled: true,
    healthSource: 'NREL / AFDC',
  },
  {
    id: 'nrel_rates',
    name: 'NREL Utility Rates',
    description: 'Average residential / commercial / industrial $/kWh by location (2012 Ventyx baseline — rough screening).',
    icon: 'bolt',
    defaultEnabled: true,
    healthSource: 'NREL Utility Rates',
  },
  {
    id: 'nrel_pvwatts',
    name: 'NREL PVWatts',
    description: 'Estimated annual AC kWh and capacity factor for rooftop / canopy solar co-location (NSRDB weather).',
    icon: 'solar_power',
    defaultEnabled: true,
    healthSource: 'NREL PVWatts',
  },
  {
    id: 'epa',
    name: 'EPA Envirofacts',
    description: 'ACRES brownfield sites, cleanup status, institutional controls, and contaminant data.',
    icon: 'eco',
    defaultEnabled: true,
    healthSource: 'EPA Envirofacts',
  },
  {
    id: 'epa_ust',
    name: 'EPA UST Finder',
    description: 'National UST facilities, tanks, and LUST (leaking UST) releases — former gas-station signal layer.',
    icon: 'local_gas_station',
    defaultEnabled: true,
    healthSource: 'EPA UST Finder',
  },
  {
    id: 'hud',
    name: 'HUD REO (eGIS)',
    description: 'FHA single-family REO inventory — federal REO dots for motivated-seller / auction workflows.',
    icon: 'real_estate_agent',
    defaultEnabled: true,
    healthSource: 'HUD eGIS / REO',
  },
  {
    id: 'fhwa',
    name: 'FHWA Corridors',
    description: 'Alternative Fuel Corridors — NEVI-eligible highway segments for federal subsidy targeting.',
    icon: 'route',
    defaultEnabled: true,
    healthSource: 'FHWA Corridors',
  },
  {
    id: 'ejscreen',
    name: 'EPA EJScreen',
    description: 'Environmental justice screening — demographics, disadvantaged community flags, and equity indexes.',
    icon: 'balance',
    defaultEnabled: true,
    healthSource: 'EPA EJScreen',
  },
  {
    id: 'ny_dec',
    name: 'NY DEC Remediation',
    description: 'New York State remediation program sites (BCP, VCP, etc.) — addresses and program metadata from Open Data.',
    icon: 'landscape',
    defaultEnabled: true,
    healthSource: 'NY DEC Remediation',
  },
  {
    id: 'ca_dtsc',
    name: 'CA DTSC EnviroStor',
    description: 'California cleanup sites public export — project name, status, location, and site type for screening.',
    icon: 'water_damage',
    defaultEnabled: true,
    healthSource: 'CA DTSC EnviroStor',
  },
  {
    id: 'tx_lpst',
    name: 'TX TCEQ LPST',
    description: 'Texas leaking petroleum storage tank sites — TCEQ open data for former fuel / UST-adjacent signals.',
    icon: 'oil_barrel',
    defaultEnabled: true,
    healthSource: 'TX TCEQ LPST',
  },
  {
    id: 'zai_web_search',
    name: 'Z.AI Web Search',
    description:
      'Unstructured discovery layer — news, closures, municipal pages, and other web sources that lack clean APIs (Part B signals).',
    icon: 'travel_explore',
    defaultEnabled: true,
    healthSource: 'Z.AI Web Search',
  },
]

type TeamMember = { initials: string; name: string; role: string; badge: string; muted?: boolean }

const TEAM_MEMBERS: TeamMember[] = [
  { initials: 'RM', name: 'Raymond McSpirit', role: 'CEO / Head of Sales', badge: 'Admin' },
  { initials: 'KN', name: 'Kenny', role: 'Head of Sourcing', badge: 'Editor' },
  { initials: 'SP', name: 'Shai Perednik', role: 'Fractional CPTO', badge: 'Editor' },
]

function statusLabel(health: ApiHealthResult | undefined, isEnabled: boolean): string {
  if (!isEnabled) return 'Disabled'
  if (!health) return 'Checking…'
  if (health.status === 'connected') return health.latencyMs ? `Connected · ${health.latencyMs}ms` : 'Connected'
  if (health.status === 'no_key') return 'API Key Required'
  return health.message || 'Error'
}

function statusColor(health: ApiHealthResult | undefined, isEnabled: boolean): string {
  if (!isEnabled) return 'text-text-muted'
  if (!health) return 'text-text-muted animate-pulse'
  if (health.status === 'connected') return 'text-brand-muted'
  if (health.status === 'no_key') return 'text-[#D97706]'
  return 'text-danger'
}

function dotColor(health: ApiHealthResult | undefined): string {
  if (!health) return 'bg-text-muted animate-pulse'
  if (health.status === 'connected') return 'bg-brand-muted'
  if (health.status === 'no_key') return 'bg-[#D97706]'
  return 'bg-danger'
}

export function Settings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.defaultEnabled]))
  )
  const [healthResults, setHealthResults] = useState<ApiHealthResult[]>([])
  const [checking, setChecking] = useState(false)

  const runHealthChecks = useCallback(async () => {
    setChecking(true)
    try {
      const results = await checkAllSources()
      setHealthResults(results)
    } catch {
      /* network failure */
    } finally {
      setChecking(false)
    }
  }, [])

  useEffect(() => {
    void runHealthChecks()
  }, [runHealthChecks])

  const healthFor = (source: string) => healthResults.find((h) => h.source === source)
  const connectedCount = healthResults.filter((h) => h.status === 'connected').length

  return (
    <div className="p-8 max-w-7xl mx-auto font-body">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <PageHeader
            title="Configuration & Nodes"
            subtitle="Manage cross-platform data flow and institutional preferences."
          >
            <button
              type="button"
              className="border border-border bg-surface px-4 py-2 rounded text-[13px] font-heading font-medium hover:bg-surface-subtle transition-colors"
            >
              Export Config
            </button>
            <button
              type="button"
              className="bg-brand text-white px-4 py-2 rounded text-[13px] font-heading font-medium hover:bg-[#166534] transition-colors"
            >
              Apply Changes
            </button>
          </PageHeader>

          <div className="bg-surface border border-border p-6 rounded">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-heading font-semibold text-text-base">Product onboarding</h3>
                <p className="text-xs text-text-muted mt-1 max-w-xl leading-relaxed">
                  Reopen the setup wizard to adjust product context, target personas, ICP, and growth goals. You will leave
                  this screen and use the dedicated onboarding flow.
                </p>
              </div>
              <Link
                to="/onboarding/step-1"
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-brand text-white px-4 py-2.5 rounded text-[13px] font-heading font-medium hover:bg-[#166534] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                Open setup wizard
              </Link>
            </div>
          </div>

          {/* Live Integrations */}
          <div className="bg-surface border border-border p-6 rounded">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-semibold text-text-base">Active Integrations</h3>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-brand-light text-brand border border-brand-light px-2 py-1 rounded">
                {connectedCount > 0 ? `${connectedCount} Live Node${connectedCount > 1 ? 's' : ''}` : 'Checking…'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTEGRATIONS.map((integration) => {
                const health = healthFor(integration.healthSource)
                const isOn = enabled[integration.id]
                return (
                  <div
                    key={integration.id}
                    className="border border-border p-5 rounded hover:border-brand transition-colors flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 bg-surface-muted border border-border rounded flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-text-secondary text-xl">{integration.icon}</span>
                      </div>
                      <Switch
                        checked={isOn}
                        onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [integration.id]: v }))}
                      />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-text-base text-sm">{integration.name}</p>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">{integration.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                      <span className={`text-xs font-bold ${statusColor(health, isOn)}`}>
                        {statusLabel(health, isOn)}
                      </span>
                      <button type="button" className="text-text-muted hover:text-brand p-1">
                        <span className="material-symbols-outlined text-lg">settings</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Data Provenance — live health */}
          <div className="bg-surface border border-border p-6 rounded">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-heading font-semibold text-text-base">Data Provenance</h3>
              <button
                type="button"
                disabled={checking}
                onClick={() => void runHealthChecks()}
                className="text-xs font-heading font-semibold text-brand hover:text-brand-muted disabled:opacity-50 flex items-center gap-1"
              >
                <span className={`material-symbols-outlined text-sm ${checking ? 'animate-spin' : ''}`}>refresh</span>
                {checking ? 'Checking…' : 'Recheck'}
              </button>
            </div>
            <p className="text-xs text-text-muted mb-6">Live upstream API health for intelligence pipelines.</p>
            <ul className="space-y-4">
              {healthResults.length === 0 && (
                <li className="text-sm text-text-muted animate-pulse">Running health checks…</li>
              )}
              {healthResults.map((h) => (
                <li key={h.source} className="flex items-start gap-3 text-sm">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor(h)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-base">{h.source}</p>
                    <p className="text-xs text-text-muted">{h.message}</p>
                  </div>
                  {h.latencyMs != null && (
                    <span className="font-mono text-xs text-text-muted shrink-0">{h.latencyMs}ms</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface border border-border p-6 rounded flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded bg-brand-light flex items-center justify-center text-brand font-heading font-bold text-2xl mb-4">
              RM
            </div>
            <p className="font-heading font-semibold text-text-base">Raymond McSpirit</p>
            <p className="text-sm text-text-muted mt-1">CEO / Head of Sales · EVR Advisors</p>
            <div className="w-full mt-6 pt-6 border-t border-border space-y-3 text-left text-sm">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Email</p>
                <p className="text-text-base">ray@evradvisors.com</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Timezone</p>
                <p className="text-text-base">America/New_York (EST)</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-text-base text-sm">Team Members</h3>
              <button type="button" className="text-text-muted hover:text-brand p-1">
                <span className="material-symbols-outlined text-xl">person_add</span>
              </button>
            </div>
            <ul className="space-y-3">
              {TEAM_MEMBERS.map((m) => (
                <li
                  key={m.initials}
                  className={`flex items-center gap-3 ${m.muted ? 'opacity-60' : ''}`}
                >
                  <div className="w-8 h-8 bg-surface-muted border border-border rounded flex items-center justify-center text-[10px] font-bold text-text-secondary shrink-0">
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-base truncate">{m.name}</p>
                    <p className="text-xs text-text-muted">{m.role}</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wide text-text-muted border border-border px-1.5 py-0.5 rounded shrink-0">
                    {m.badge}
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="w-full mt-4 py-2 border border-dashed border-border rounded text-xs font-heading font-semibold text-text-muted hover:border-brand hover:text-brand transition-colors"
            >
              View All 12 Members
            </button>
          </div>

          <div className="bg-brand text-white p-6 rounded border border-brand">
            <p className="text-[11px] font-mono uppercase tracking-widest text-white/80">Monthly API Usage</p>
            <p className="font-heading text-2xl font-semibold tracking-tight mt-2">82,440 Calls / 100k</p>
            <div className="mt-4 h-1.5 bg-black/20 rounded overflow-hidden">
              <div className="bg-brand-muted h-full w-[82%] rounded" />
            </div>
            <p className="text-xs text-white/70 mt-3 italic">Resets on the 1st of each month. Overage billed at tier-2 rates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
