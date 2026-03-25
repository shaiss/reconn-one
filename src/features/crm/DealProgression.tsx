import { PageHeader } from '../../components/PageHeader'
import { Badge } from '../../components/Badge'

type DealStatus = 'On Track' | 'Delayed' | 'High Risk' | 'Ready' | 'Funded' | 'Review' | 'Finalizing'

type Deal = {
  id: string
  company: string
  size: string
  status: DealStatus
  statusVariant: 'positive' | 'danger' | 'neutral' | 'funded' | 'muted'
  note?: string
  noteType?: 'error' | 'success' | 'info'
  progress?: number
}

type KanbanColumn = { stage: number; title: string; accentColor: string; deals: Deal[] }

const COLUMNS: KanbanColumn[] = [
  {
    stage: 3,
    title: 'Technical Convertibility',
    accentColor: 'border-border',
    deals: [
      { id: 'VP-9021', company: 'OmniGrid Systems LLC', size: '$84.5M', status: 'On Track', statusVariant: 'positive' },
      {
        id: 'VP-8832',
        company: 'Lithium-Core Kinetics',
        size: '$210.0M',
        status: 'Delayed',
        statusVariant: 'danger',
        note: 'Tesla compatibility assessment pending',
        noteType: 'error',
      },
    ],
  },
  {
    stage: 4,
    title: 'Physical Feasibility',
    accentColor: 'border-brand-muted',
    deals: [
      {
        id: 'VP-1102',
        company: 'Northeast Transit Network',
        size: '$42.1M',
        status: 'Ready',
        statusVariant: 'positive',
        note: '8 sites surveyed',
      },
    ],
  },
  {
    stage: 5,
    title: 'Economic Survivability',
    accentColor: 'border-border',
    deals: [
      {
        id: 'VP-9941',
        company: 'SolarStream Renewables',
        size: '$12.5M',
        status: 'High Risk',
        statusVariant: 'danger',
        progress: 75,
        note: 'Utility interconnection cost overrun — $280K upgrade required',
        noteType: 'error',
      },
      { id: 'VP-8772', company: 'Voltaic Charge Points', size: '$67.9M', status: 'On Track', statusVariant: 'positive' },
    ],
  },
  {
    stage: 6,
    title: 'Control & Structure',
    accentColor: 'border-brand-muted',
    deals: [
      {
        id: 'VP-4412',
        company: 'EcoFleet Logistics Intl.',
        size: '$156.0M',
        status: 'Review',
        statusVariant: 'muted',
        note: 'Majority Stake (72%)',
      },
    ],
  },
  {
    stage: 7,
    title: 'Capital Fit',
    accentColor: 'border-border',
    deals: [{ id: 'VP-0021', company: 'Zenith Charging Hubs', size: '$540.0M', status: 'Funded', statusVariant: 'funded' }],
  },
  {
    stage: 8,
    title: 'Execution',
    accentColor: 'border-brand',
    deals: [
      {
        id: 'VP-1002',
        company: 'UrbanGrid EV Solutions',
        size: '$28.2M',
        status: 'Finalizing',
        statusVariant: 'positive',
        note: 'Closing documents sent — Tesla rip-and-replace approved',
        noteType: 'success',
      },
    ],
  },
]

const STATS: { label: string; value: string; danger?: boolean }[] = [
  { label: 'Total Pipeline Value', value: '$1.42B' },
  { label: 'Active Entities', value: '42' },
  { label: 'Avg. Deal Velocity', value: '182 Days' },
  { label: 'Risk Exposure', value: '12.4%', danger: true },
]

function DealCard({ deal }: { deal: Deal }) {
  const leftBorder =
    deal.status === 'Funded'
      ? 'border-l-4 border-l-brand'
      : deal.status === 'High Risk'
        ? 'border-l-4 border-l-danger'
        : ''

  const noteColor =
    deal.noteType === 'error'
      ? 'text-danger'
      : deal.noteType === 'success'
        ? 'text-brand-muted'
        : 'text-text-muted'

  return (
    <div
      className={`bg-surface border border-border p-4 flex flex-col gap-3 hover:border-text-secondary cursor-pointer transition-colors ${leftBorder}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-text-muted">{deal.id}</span>
        <Badge label={deal.status} variant={deal.statusVariant} />
      </div>
      <p className="font-heading font-semibold text-text-base text-sm tracking-tight">{deal.company}</p>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-0.5">Deal Size</p>
        <p className="font-mono text-base text-text-base">{deal.size}</p>
      </div>
      {deal.note && <p className={`text-xs font-body leading-snug ${noteColor}`}>{deal.note}</p>}
      {deal.progress != null && (
        <div className="w-full bg-surface-muted h-1 rounded overflow-hidden">
          <div className="bg-danger h-1 rounded" style={{ width: `${deal.progress}%` }} />
        </div>
      )}
    </div>
  )
}

export function DealProgression() {
  return (
    <div className="p-8 max-w-[1800px] mx-auto flex flex-col font-body">
      <PageHeader
        title="Deal Progression Tracker"
        subtitle="Advanced Pipeline Analysis: M&A Stages 3–8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 border border-border rounded p-0.5 bg-surface-muted">
            <button
              type="button"
              className="px-3 py-1.5 text-[11px] font-heading font-semibold uppercase tracking-widest bg-brand text-white rounded"
            >
              Board View
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-[11px] font-heading font-semibold uppercase tracking-widest text-text-muted hover:text-text-base rounded"
            >
              Timeline View
            </button>
          </div>
          <button
            type="button"
            className="bg-brand text-white px-4 py-2 rounded text-[13px] font-heading font-medium hover:bg-[#166534] transition-colors"
          >
            Create New Deal
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border my-6">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-text-muted">{s.label}</h3>
            <p
              className={`font-heading text-2xl font-semibold tracking-tight ${s.danger ? 'text-danger' : 'text-brand'}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[320px]">
        {COLUMNS.map((col) => (
          <div key={col.stage} className="min-w-[320px] flex flex-col gap-4 shrink-0">
            <div className={`border-b-4 ${col.accentColor} pb-3 flex items-center justify-between`}>
              <div>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Stage {col.stage}</p>
                <p className="font-heading font-semibold text-text-base text-sm tracking-tight mt-0.5">{col.title}</p>
              </div>
              <span className="text-xs font-mono bg-surface-muted border border-border px-2 py-0.5 rounded text-text-secondary">
                {col.deals.length}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {col.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="h-10 bg-surface-muted border border-border px-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-muted mt-8 rounded">
        <span>Database sync: 2m ago</span>
        <span>Ray McSpirit · Admin</span>
      </footer>
    </div>
  )
}
