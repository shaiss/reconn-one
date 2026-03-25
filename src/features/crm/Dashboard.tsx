import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { StatCard } from '../../components/StatCard'
import { SectionPanel } from '../../components/SectionPanel'
import { ScoreBadge } from '../../components/ScoreBadge'

const SIGNALS = [
  {
    id: 1,
    accountSlug: 'greencharge',
    account: 'GreenCharge Networks',
    dealSize: '$340,000',
    score: 94,
    signalTitle: 'NEVI Award',
    signalDesc: '8 sites funded in OH corridor; procurement window ~60 days',
    hot: true,
  },
  {
    id: 2,
    accountSlug: 'americharge',
    account: 'AmeriCharge Holdings',
    dealSize: '$1,200,000',
    score: 91,
    signalTitle: 'Rip & Replace',
    signalDesc: '22% downtime across fleet; incumbent vendor contract expiring Q3',
    hot: true,
  },
  {
    id: 3,
    accountSlug: 'peakvolt',
    account: 'PeakVolt Energy',
    dealSize: '$185,000',
    score: 78,
    signalTitle: 'Brownfield Cleared',
    signalDesc: 'NFA issued on Albany site; construction permits filed',
    hot: true,
  },
  {
    id: 4,
    accountSlug: 'rivian-fleet',
    account: 'Rivian Fleet Services',
    dealSize: '$520,000',
    score: 62,
    signalTitle: 'RFP Published',
    signalDesc: 'Seeking DCFC vendor for 22 depot locations',
    hot: false,
  },
  {
    id: 5,
    accountSlug: 'tristate-corridor',
    account: 'TriState EV Corridor Group',
    dealSize: '$95,000',
    score: 45,
    signalTitle: 'Dormant',
    signalDesc: 'No new signal activity in 30 days',
    hot: false,
  },
]

export function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = SIGNALS.filter(s =>
    s.account.toLowerCase().includes(query.toLowerCase())
  )

  const searchInput = (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">search</span>
      <input
        className="border border-border pl-8 pr-3 py-1 rounded text-[13px] focus:outline-none focus:border-brand w-[240px] bg-surface"
        placeholder="Search accounts..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  )

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8">
      <PageHeader
        title="Pipeline Pulse"
        subtitle="Monitoring active deals and recent buying signals."
      >
        <button className="border border-border bg-surface px-4 py-2 rounded text-[13px] font-heading font-medium hover:bg-surface-subtle transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Filter View
        </button>
        <button className="bg-brand text-white px-4 py-2 rounded text-[13px] font-heading font-medium hover:bg-[#166534] transition-colors">
          Sync Data
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="New Triggers" value="14" trend="+5 since yesterday" trendPositive />
        <StatCard label="High Intent Deals" value="6" trend="NEVI-funded or active RFP" />
        <StatCard label="Total Pipeline Value" value="$8.4M" trend="Across 32 active opportunities" />
      </div>

      <SectionPanel title="Active Signals" headerRight={searchInput}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-text-muted font-medium w-[25%]">Account</th>
                <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-text-muted font-medium w-[20%]">Deal Size</th>
                <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-text-muted font-medium w-[20%]">Intel Score</th>
                <th className="p-4 text-[11px] font-mono uppercase tracking-widest text-text-muted font-medium w-[35%]">Latest Signal</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {filtered.map(row => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-subtle transition-colors cursor-pointer"
                  onClick={() => navigate(`/crm/dossier/${row.accountSlug}`)}
                >
                  <td className="p-4 font-medium text-text-base">
                    <div className="flex items-center gap-2">
                      {row.hot
                        ? <div className="w-2 h-2 rounded-full bg-brand-muted shrink-0" />
                        : <div className="w-2 h-2 shrink-0" />
                      }
                      {row.account}
                    </div>
                  </td>
                  <td className="p-4 text-text-muted font-mono text-[13px]">{row.dealSize}</td>
                  <td className="p-4"><ScoreBadge score={row.score} /></td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-text-base font-medium text-[13px]">{row.signalTitle}</span>
                      <span className="text-text-muted text-[12px] truncate max-w-[300px]">{row.signalDesc}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>
    </div>
  )
}
