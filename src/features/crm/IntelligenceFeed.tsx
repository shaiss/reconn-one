import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

type FeedItem = {
  id: number
  time: string
  account: string
  score: number
  title: string
  description: string
  icon: string
  iconColor: string
  actionLabel: string
  date: 'today' | 'yesterday'
  tabKey: string
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: 1,
    time: '10:30 AM',
    account: 'GreenCharge Networks',
    score: 94,
    title: 'NEVI Award: 8 New Sites Funded in Ohio',
    description: 'FHWA corridor designation confirmed. Hardware procurement expected within 60 days.',
    icon: 'route',
    iconColor: 'text-brand',
    actionLabel: 'View Dossier',
    date: 'today',
    tabKey: 'nevi',
  },
  {
    id: 2,
    time: '09:15 AM',
    account: 'AmeriCharge Holdings',
    score: 91,
    title: 'Downtime Alert: 22% Avg Across 14 Sites',
    description: 'AFDC utilization data shows chronic reliability issues. Possible rip-and-replace opportunity.',
    icon: 'trending_down',
    iconColor: 'text-danger',
    actionLabel: 'View Dossier',
    date: 'today',
    tabKey: 'distress',
  },
  {
    id: 3,
    time: '08:05 AM',
    account: 'PeakVolt Energy',
    score: 86,
    title: 'Brownfield NFA Issued: 401 Main St, Albany NY',
    description: 'NY DEC remediation status changed to No Further Action. Site cleared for development.',
    icon: 'eco',
    iconColor: 'text-brand-muted',
    actionLabel: 'View Dossier',
    date: 'today',
    tabKey: 'environmental',
  },
  {
    id: 4,
    time: '04:20 PM',
    account: 'CrossGrid Power',
    score: 82,
    title: 'Grid Capacity: 2.4 MW Available on Feeder 1192',
    description: 'PG&E GRIP shows sufficient hosting capacity for 6-port DCFC hub at target parcel.',
    icon: 'bolt',
    iconColor: 'text-brand',
    actionLabel: 'View Dossier',
    date: 'yesterday',
    tabKey: 'grid',
  },
]

function ScoreChip({ score }: { score: number }) {
  const cls =
    score >= 80
      ? 'bg-score-positive-bg text-score-positive-text border-score-positive-border'
      : 'bg-score-neutral-bg text-score-neutral-text border-score-neutral-border'
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border font-mono shrink-0 ml-auto ${cls}`}>
      Score: {score}
    </span>
  )
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <div className="group relative flex gap-4 px-5 py-5 border-b border-border hover:bg-surface-subtle transition-colors last:border-b-0 cursor-default">
      <div className="shrink-0 pt-1">
        <div className={`w-10 h-10 rounded border border-border bg-surface flex items-center justify-center ${item.iconColor}`}>
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0 pr-28">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[11px] text-text-muted font-mono shrink-0">{item.time}</span>
          <span className="text-text-base font-medium font-body truncate">{item.account}</span>
          <ScoreChip score={item.score} />
        </div>
        <p className="text-text-base text-sm font-medium font-body mb-1">{item.title}</p>
        <p className="text-text-muted text-sm font-body leading-relaxed truncate">{item.description}</p>
      </div>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="flex items-center justify-center px-4 h-8 bg-surface border border-border text-text-base text-[12px] font-heading font-medium rounded hover:bg-surface-subtle">
          {item.actionLabel}
        </button>
      </div>
    </div>
  )
}

const TAB_LABELS: Record<string, string> = {
  all: 'All',
  nevi: 'NEVI',
  distress: 'Distress',
  environmental: 'Environmental',
  grid: 'Grid',
}

export function IntelligenceFeed() {
  const [activeTab, setActiveTab] = useState('all')

  const todayItems = FEED_ITEMS.filter(
    i => i.date === 'today' && (activeTab === 'all' || i.tabKey === activeTab)
  )
  const yesterdayItems = FEED_ITEMS.filter(
    i => i.date === 'yesterday' && (activeTab === 'all' || i.tabKey === activeTab)
  )

  return (
    <div className="h-full overflow-y-auto bg-surface-subtle">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 bg-surface-subtle border-b border-border px-8 py-6">
        <div className="max-w-[640px] mx-auto w-full flex justify-between items-end">
          <div>
            <h1 className="text-text-base font-heading text-2xl font-semibold tracking-tight">
              Intelligence Feed
            </h1>
            <p className="text-text-muted text-sm font-body mt-1">
              Chronological stream of active account signals.
            </p>
          </div>
          <button className="px-3 py-1.5 border border-border rounded text-sm font-medium font-body hover:bg-surface transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filter
          </button>
        </div>
      </header>

      {/* Feed */}
      <div className="max-w-[640px] mx-auto w-full pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab bar — sticky below header */}
          <div className="sticky top-[89px] z-10 bg-surface-subtle border-b border-border px-4 py-2">
            <TabsList className="bg-transparent gap-1 h-auto p-0">
              {Object.entries(TAB_LABELS).map(([value, label]) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="text-[11px] font-mono uppercase tracking-widest px-3 py-1.5 rounded data-[state=active]:bg-brand data-[state=active]:text-white data-[state=inactive]:text-text-muted data-[state=inactive]:hover:text-text-base transition-colors"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {todayItems.length > 0 && (
              <>
                <div className="sticky top-[137px] z-10 bg-surface-subtle py-3 border-b border-border">
                  <h3 className="text-text-muted text-[11px] font-mono uppercase tracking-widest px-4">
                    Today, Oct 24
                  </h3>
                </div>
                <div className="flex flex-col bg-surface border-x border-b border-border mb-8">
                  {todayItems.map(item => (
                    <FeedCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}

            {yesterdayItems.length > 0 && (
              <>
                <div className="sticky top-[137px] z-10 bg-surface-subtle py-3 border-b border-border">
                  <h3 className="text-text-muted text-[11px] font-mono uppercase tracking-widest px-4">
                    Yesterday, Oct 23
                  </h3>
                </div>
                <div className="flex flex-col bg-surface border-x border-b border-border mb-8">
                  {yesterdayItems.map(item => (
                    <FeedCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}

            {todayItems.length === 0 && yesterdayItems.length === 0 && (
              <div className="py-16 text-center text-text-muted text-sm font-body">
                No signals for this filter.
              </div>
            )}

            {/* Loading indicator */}
            <div className="py-8 flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-text-muted animate-spin text-[20px]">
                progress_activity
              </span>
              <span className="text-[11px] text-text-muted font-mono uppercase tracking-widest">
                Loading older signals...
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
