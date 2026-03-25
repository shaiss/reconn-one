import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { SectionPanel } from '../../components/SectionPanel'
import { ScoreBadge } from '../../components/ScoreBadge'

type Account = {
  id: string
  name: string
  domain: string
  icon: string
  iconBg: string
  iconColor: string
  segment: string
  segmentClasses: string
  totalSites: string
  network: string
  signal: string
  signalActive: boolean
  signalPulse: boolean
  signalColor: string
  score: number
}

const ACCOUNTS: Account[] = [
  {
    id: 'greencharge',
    name: 'GreenCharge Networks',
    domain: 'greencharge.io',
    icon: 'ev_station',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    segment: 'CPO',
    segmentClasses: 'bg-brand-light text-brand border border-brand-light',
    totalSites: '45',
    network: 'BTC Power, ChargePoint',
    signal: 'NEVI Ohio Bundle',
    signalActive: true,
    signalPulse: true,
    signalColor: 'text-brand',
    score: 94,
  },
  {
    id: 'americharge',
    name: 'AmeriCharge Holdings',
    domain: 'americharge.com',
    icon: 'local_fire_department',
    iconBg: 'bg-danger-light',
    iconColor: 'text-danger',
    segment: 'CPO',
    segmentClasses: 'bg-danger-light text-danger border border-danger-light',
    totalSites: '214',
    network: 'Mixed OEM',
    signal: 'Rip & Replace Window',
    signalActive: true,
    signalPulse: true,
    signalColor: 'text-danger',
    score: 91,
  },
  {
    id: 'peakvolt',
    name: 'PeakVolt Energy',
    domain: 'peakvolt.energy',
    icon: 'construction',
    iconBg: 'bg-surface-muted',
    iconColor: 'text-text-secondary',
    segment: 'Developer',
    segmentClasses: 'bg-surface-muted text-text-secondary border border-border',
    totalSites: '12',
    network: 'Internal pipeline',
    signal: 'Brownfield NFA — Albany',
    signalActive: true,
    signalPulse: false,
    signalColor: 'text-[#D97706]',
    score: 78,
  },
  {
    id: 'rivian-fleet',
    name: 'Rivian Fleet Services',
    domain: 'rivian.com',
    icon: 'local_shipping',
    iconBg: 'bg-[#EFF6FF]',
    iconColor: 'text-[#1E40AF]',
    segment: 'Fleet',
    segmentClasses: 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]',
    totalSites: '22',
    network: 'Depot DCFC RFP',
    signal: 'RFP Live',
    signalActive: true,
    signalPulse: false,
    signalColor: 'text-brand',
    score: 62,
  },
  {
    id: 'tristate-corridor',
    name: 'TriState EV Corridor Group',
    domain: 'tristate-ev.org',
    icon: 'route',
    iconBg: 'bg-[#FEFCE8]',
    iconColor: 'text-[#854D0E]',
    segment: 'Transit JV',
    segmentClasses: 'bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]',
    totalSites: '8',
    network: 'Highway corridor bundle',
    signal: 'Dormant (30d)',
    signalActive: false,
    signalPulse: false,
    signalColor: 'text-text-muted',
    score: 45,
  },
  {
    id: 'crossgrid',
    name: 'CrossGrid Power',
    domain: 'crossgrid.io',
    icon: 'bolt',
    iconBg: 'bg-brand-light',
    iconColor: 'text-brand',
    segment: 'Grid Dev',
    segmentClasses: 'bg-score-positive-bg text-score-positive-text border border-score-positive-border',
    totalSites: '6',
    network: 'PG&E queue / GRIP',
    signal: 'Hosting Capacity OK',
    signalActive: true,
    signalPulse: false,
    signalColor: 'text-brand-muted',
    score: 82,
  },
]

const TABLE_COLS = ['Account Name', 'Segment', 'Total Sites', 'Current Network', 'Active Signal', 'Intel Score']

export function AccountList() {
  const navigate = useNavigate()

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* PageHeader */}
      <div className="mb-10">
        <PageHeader
          title="Account List"
          subtitle="Centralized intelligence monitoring for high-priority EV infrastructure partners."
        >
          <button className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded text-[11px] font-mono font-bold uppercase tracking-widest hover:bg-[#166534] transition-colors">
            <span className="material-symbols-outlined text-sm">add</span>
            New Account
          </button>
        </PageHeader>
      </div>

      {/* Table */}
      <SectionPanel>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle border-b border-border">
                {TABLE_COLS.map(col => (
                  <th
                    key={col}
                    className={`px-6 py-4 text-[10px] font-mono uppercase tracking-widest text-text-muted font-medium${col === 'Intel Score' ? ' text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ACCOUNTS.map(account => (
                <tr
                  key={account.id}
                  className="hover:bg-surface-subtle transition-colors cursor-pointer"
                  onClick={() => navigate(`/crm/dossier/${account.id}`)}
                >
                  {/* Account Name */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 ${account.iconBg} flex items-center justify-center border border-border rounded shrink-0`}
                      >
                        <span className={`material-symbols-outlined ${account.iconColor}`}>
                          {account.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-base font-body">{account.name}</p>
                        <p className="text-[10px] text-text-muted font-mono">{account.domain}</p>
                      </div>
                    </div>
                  </td>

                  {/* Segment */}
                  <td className="px-6 py-5">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded ${account.segmentClasses}`}
                    >
                      {account.segment}
                    </span>
                  </td>

                  {/* Total Sites */}
                  <td className="px-6 py-5 font-mono text-sm text-text-base">{account.totalSites}</td>

                  {/* Current Network */}
                  <td className="px-6 py-5 text-sm text-text-muted font-body">{account.network}</td>

                  {/* Active Signal */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${account.signalActive ? 'bg-brand-muted' : 'bg-border'} ${account.signalPulse ? 'animate-pulse' : ''}`}
                      />
                      <span className={`text-[11px] font-bold uppercase font-mono ${account.signalColor}`}>
                        {account.signal}
                      </span>
                    </div>
                  </td>

                  {/* Intel Score */}
                  <td className="px-6 py-5 text-right">
                    <ScoreBadge score={account.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer / pagination */}
        <div className="px-6 py-4 bg-surface border-t border-border flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
            Showing 1–6 of 1,482 Accounts
          </span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-text-muted border border-border hover:bg-surface-subtle transition-colors rounded">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-brand text-white font-mono text-xs font-bold rounded">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-text-muted border border-border hover:bg-surface-subtle font-mono text-xs rounded">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-text-muted border border-border hover:bg-surface-subtle font-mono text-xs rounded">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center text-text-muted border border-border hover:bg-surface-subtle transition-colors rounded">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </SectionPanel>

      {/* Bento cards */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Penetration Signal */}
        <div className="lg:col-span-2 bg-[#14532D] text-white p-8 overflow-hidden relative group rounded">
          <div className="relative z-10">
            <h3 className="text-2xl font-heading font-semibold mb-4 tracking-tight">
              Market Penetration Signal
            </h3>
            <p className="text-green-100 max-w-md mb-6 leading-relaxed font-body text-sm">
              Intelligence analysis indicates a 22% surge in EPC contract filings across the North American
              Northeast region in the last 72 hours. Five Tier-1 accounts are currently active in this RFP
              cycle.
            </p>
            <button className="bg-white text-[#14532D] px-6 py-3 text-[11px] font-mono font-bold uppercase tracking-widest hover:bg-green-50 transition-colors rounded">
              View Deep Signal Report
            </button>
          </div>
        </div>

        {/* Top Contributor */}
        <div className="bg-surface border border-border p-6 flex flex-col justify-between rounded">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
                Top Contributor
              </h4>
              <span className="material-symbols-outlined text-brand-muted">verified</span>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded bg-surface-muted border border-border flex items-center justify-center font-heading font-bold text-text-secondary">
                KN
              </div>
              <div>
                <p className="text-sm font-bold text-text-base font-body">Kenny</p>
                <p className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">
                  Head of Sourcing
                </p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
              Active Leads
            </span>
            <span className="font-mono text-lg font-bold text-brand">42</span>
          </div>
        </div>
      </div>
    </div>
  )
}
