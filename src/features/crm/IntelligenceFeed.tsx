import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  fetchIntelligenceFeedItems,
  type IntelligenceFeedItem,
} from '@/lib/intelligenceFeedData.ts'

/** Curated fallback when live APIs return nothing (offline / all errors). */
const FALLBACK_ITEMS: IntelligenceFeedItem[] = [
  {
    id: 'fb-1',
    time: '10:30 AM',
    account: 'GreenCharge Networks',
    accountSlug: 'greencharge',
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
    id: 'fb-2',
    time: '09:15 AM',
    account: 'AmeriCharge Holdings',
    accountSlug: 'americharge',
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
    id: 'fb-3',
    time: '08:05 AM',
    account: 'PeakVolt Energy',
    accountSlug: 'peakvolt',
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
    id: 'fb-4',
    time: '04:20 PM',
    account: 'CrossGrid Power',
    accountSlug: 'crossgrid',
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

function FeedCard({ item }: { item: IntelligenceFeedItem }) {
  const dossierHref = `/crm/dossier/${item.accountSlug}`
  return (
    <div className="group relative flex gap-4 px-5 py-5 border-b border-border hover:bg-surface-subtle transition-colors last:border-b-0 cursor-default">
      <div className="shrink-0 pt-1">
        <div
          className={`w-10 h-10 rounded border border-border bg-surface flex items-center justify-center ${item.iconColor}`}
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0 pr-28">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-[11px] text-text-muted font-mono shrink-0">{item.time}</span>
          <span className="text-text-base font-medium font-body truncate">{item.account}</span>
          {item.sourceLabel && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted border border-border px-1.5 py-0 rounded">
              {item.sourceLabel}
            </span>
          )}
          <ScoreChip score={item.score} />
        </div>
        <p className="text-text-base text-sm font-medium font-body mb-1">{item.title}</p>
        <p className="text-text-muted text-sm font-body leading-relaxed">{item.description}</p>
      </div>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        {item.externalUrl ? (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 h-8 bg-surface border border-border text-text-base text-[12px] font-heading font-medium rounded hover:bg-surface-subtle"
          >
            {item.actionLabel}
          </a>
        ) : (
          <Link
            to={dossierHref}
            className="flex items-center justify-center px-4 h-8 bg-surface border border-border text-text-base text-[12px] font-heading font-medium rounded hover:bg-surface-subtle"
          >
            {item.actionLabel}
          </Link>
        )}
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
  const [items, setItems] = useState<IntelligenceFeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadErrors, setLoadErrors] = useState<string[]>([])
  const [usedFallback, setUsedFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadErrors([])
      try {
        const { items: live, errors } = await fetchIntelligenceFeedItems()
        if (cancelled) return
        setLoadErrors(errors)
        if (live.length > 0) {
          setItems(live)
          setUsedFallback(false)
        } else {
          setItems(FALLBACK_ITEMS)
          setUsedFallback(true)
        }
      } catch {
        if (!cancelled) {
          setItems(FALLBACK_ITEMS)
          setUsedFallback(true)
          setLoadErrors((e) => [...e, 'Feed request failed'])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const todayItems = items.filter(
    i => i.date === 'today' && (activeTab === 'all' || i.tabKey === activeTab),
  )
  const yesterdayItems = items.filter(
    i => i.date === 'yesterday' && (activeTab === 'all' || i.tabKey === activeTab),
  )

  const todayHeading = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
  const yesterdayDate = new Date(Date.now() - 86400000)
  const yesterdayHeading = yesterdayDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="h-full overflow-y-auto bg-surface-subtle">
      <header className="sticky top-0 z-20 bg-surface-subtle border-b border-border px-8 py-6">
        <div className="max-w-[640px] mx-auto w-full flex justify-between items-end gap-4">
          <div>
            <h1 className="text-text-base font-heading text-2xl font-semibold tracking-tight">
              Intelligence Feed
            </h1>
            <p className="text-text-muted text-sm font-body mt-1">
              Live signals from FHWA corridors, NREL AFDC & utility rates, NY remediation, EPA EJScreen, and optional
              Z.AI search.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 px-3 py-1.5 border border-border rounded text-sm font-medium font-body hover:bg-surface transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            Filter
          </button>
        </div>
      </header>

      <div className="max-w-[640px] mx-auto w-full pb-24">
        {!loading && loadErrors.length > 0 && (
          <div className="mx-4 mt-4 rounded border border-border bg-surface-muted px-4 py-3 text-xs text-text-muted font-body">
            <p className="font-mono uppercase tracking-wider text-[10px] text-text-secondary mb-1">Data sources</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {loadErrors.slice(0, 6).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            {usedFallback && (
              <p className="mt-2 text-text-secondary">Showing curated fallback cards until live data is available.</p>
            )}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {loading && (
              <div className="py-20 flex flex-col justify-center items-center gap-3">
                <span className="material-symbols-outlined text-text-muted animate-spin text-[28px]">
                  progress_activity
                </span>
                <span className="text-[11px] text-text-muted font-mono uppercase tracking-widest">
                  Loading live signals…
                </span>
              </div>
            )}

            {!loading && todayItems.length > 0 && (
              <>
                <div className="sticky top-[137px] z-10 bg-surface-subtle py-3 border-b border-border">
                  <h3 className="text-text-muted text-[11px] font-mono uppercase tracking-widest px-4">
                    Today, {todayHeading}
                  </h3>
                </div>
                <div className="flex flex-col bg-surface border-x border-b border-border mb-8">
                  {todayItems.map(item => (
                    <FeedCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}

            {!loading && yesterdayItems.length > 0 && (
              <>
                <div className="sticky top-[137px] z-10 bg-surface-subtle py-3 border-b border-border">
                  <h3 className="text-text-muted text-[11px] font-mono uppercase tracking-widest px-4">
                    Yesterday, {yesterdayHeading}
                  </h3>
                </div>
                <div className="flex flex-col bg-surface border-x border-b border-border mb-8">
                  {yesterdayItems.map(item => (
                    <FeedCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}

            {!loading && todayItems.length === 0 && yesterdayItems.length === 0 && (
              <div className="py-16 text-center text-text-muted text-sm font-body">
                No signals for this filter.
              </div>
            )}

            {!loading && !usedFallback && items.length > 0 && (
              <div className="py-6 flex justify-center items-center gap-2 text-text-muted">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="text-[11px] font-mono uppercase tracking-widest">End of live batch</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
