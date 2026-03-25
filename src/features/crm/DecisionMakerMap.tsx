import { useCallback, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'

type NodeSentiment = 'positive' | 'neutral' | 'negative'

type MapNode = {
  id: string
  name: string
  title: string
  score: number
  sentiment: NodeSentiment
  x: number
  y: number
  initials: string
}

type Edge = {
  from: string
  to: string
  type: 'strong' | 'neutral' | 'friction'
}

const NODES: MapNode[] = [
  { id: 'ceo', name: 'Tom Archer', title: 'Chief Executive Officer', score: 78, sentiment: 'positive', x: 350, y: 116, initials: 'TA' },
  { id: 'cfo', name: 'Linda Zhao', title: 'Chief Financial Officer', score: 55, sentiment: 'neutral', x: 200, y: 320, initials: 'LZ' },
  { id: 'vpproc', name: 'Sarah Chen', title: 'VP Procurement', score: 92, sentiment: 'positive', x: 500, y: 320, initials: 'SC' },
  { id: 'dsd', name: 'Mark Rivera', title: 'Director of Site Development', score: 68, sentiment: 'neutral', x: 400, y: 520, initials: 'MR' },
  { id: 'netops', name: 'David Park', title: 'Head of Network Operations', score: 38, sentiment: 'negative', x: 600, y: 520, initials: 'DP' },
]

const EDGES: Edge[] = [
  { from: 'ceo', to: 'cfo', type: 'strong' },
  { from: 'ceo', to: 'vpproc', type: 'strong' },
  { from: 'ceo', to: 'dsd', type: 'neutral' },
  { from: 'vpproc', to: 'dsd', type: 'strong' },
  { from: 'cfo', to: 'vpproc', type: 'neutral' },
  { from: 'netops', to: 'dsd', type: 'friction' },
]

const CONTACT_HISTORY = [
  {
    id: 'h1',
    date: 'Today, 10:42 AM',
    title: 'Reviewed NEVI compliance brief',
    detail: 'Opened EVR attachment twice; 6m dwell on uptime SLA vs. NEVI expectations.',
    dot: 'brand-muted' as const,
  },
  {
    id: 'h2',
    date: 'Oct 12, 2:30 PM',
    title: 'Site visit: I-71 corridor hub',
    detail: 'Discussed hardware upgrade timeline with Dir. Site Development; flagged two BTC Power posts for follow-up.',
    dot: 'brand' as const,
  },
  {
    id: 'h3',
    date: 'Sep 28, 9:00 AM',
    title: 'Intro via Ray McSpirit at ChargEx',
    detail: 'Warm handoff after Ohio corridor panel; VP Procurement CC’d on recap.',
    dot: 'border' as const,
  },
]

const sentimentBorderColor: Record<NodeSentiment, string> = {
  positive: '#22C55E',
  neutral: '#EAB308',
  negative: '#B91C1C',
}

const sentimentScoreClasses: Record<NodeSentiment, string> = {
  positive: 'bg-score-positive-bg text-score-positive-text border-score-positive-border',
  neutral: 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]',
  negative: 'bg-danger-light text-danger border-danger-light',
}

const edgeStroke: Record<Edge['type'], string> = {
  strong: '#22C55E',
  neutral: '#94A3B8',
  friction: '#B91C1C',
}

function nodeById(id: string): MapNode | undefined {
  return NODES.find((n) => n.id === id)
}

function edgePath(a: MapNode, b: MapNode): string {
  const ax = a.x + 90
  const ay = a.y + 32
  const bx = b.x + 90
  const by = b.y + 32
  const midY = (a.y + b.y) / 2
  return `M ${ax} ${ay} C ${ax} ${midY}, ${bx} ${midY}, ${bx} ${by}`
}

function dotClass(dot: (typeof CONTACT_HISTORY)[number]['dot']) {
  if (dot === 'brand-muted') return 'bg-brand-muted'
  if (dot === 'brand') return 'bg-brand'
  return 'bg-border'
}

export function DecisionMakerMap() {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(NODES[0])
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback(
    (e: ReactMouseEvent) => {
      if (e.button !== 0) return
      setIsDragging(true)
      dragRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }
    },
    [panOffset.x, panOffset.y]
  )

  const onMouseMove = useCallback((e: ReactMouseEvent) => {
    if (!isDragging) return
    setPanOffset({
      x: e.clientX - dragRef.current.x,
      y: e.clientY - dragRef.current.y,
    })
  }, [isDragging])

  const onMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const roleTypeLabel =
    selectedNode?.sentiment === 'positive'
      ? 'Champion'
      : selectedNode?.sentiment === 'negative'
        ? 'Blocker'
        : 'Influencer'

  return (
    <div className="flex h-full min-h-0 font-body bg-surface-subtle">
      <aside className="w-[280px] shrink-0 bg-surface border-r border-border p-5 overflow-y-auto">
        <h2 className="font-heading font-semibold text-text-base tracking-tight">Map Filters</h2>
        <p className="text-xs text-text-muted mt-2 leading-relaxed">Refine visible stakeholders and relationship paths.</p>

        <div className="mt-6 space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Roles</p>
          {['Decision Makers', 'Champions', 'Blockers', 'Influencers'].map((label) => (
            <label key={label} className="flex items-center gap-2 text-sm text-text-base cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-border" />
              {label}
            </label>
          ))}
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-3">Sentiment</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-muted" />
              Positive
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              Neutral
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger" />
              Negative
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <button
            type="button"
            className="w-full py-2 border border-border rounded text-xs font-heading font-semibold text-text-base hover:border-brand transition-colors"
          >
            Add Node
          </button>
          <button
            type="button"
            className="w-full py-2 bg-surface-muted border border-border rounded text-xs font-heading font-semibold text-text-secondary hover:bg-surface-strong transition-colors"
          >
            Sync from Salesforce
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 relative overflow-hidden min-h-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          backgroundImage:
            'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundColor: '#F8FAFC',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
          <svg className="absolute inset-0 w-full h-full min-w-[1200px] min-h-[800px] pointer-events-none" aria-hidden>
            {EDGES.map((edge) => {
              const a = nodeById(edge.from)
              const b = nodeById(edge.to)
              if (!a || !b) return null
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edgePath(a, b)}
                  fill="none"
                  stroke={edgeStroke[edge.type]}
                  strokeWidth={2}
                  strokeDasharray={edge.type === 'friction' ? '4 4' : undefined}
                />
              )
            })}
          </svg>

          {NODES.map((node) => (
            <div
              key={node.id}
              role="button"
              tabIndex={0}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedNode(node)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedNode(node)
                }
              }}
              className={`absolute w-[180px] bg-surface border p-3 cursor-pointer hover:border-text-muted transition-colors rounded ${
                selectedNode?.id === node.id ? 'border-brand border-2' : 'border-border'
              }`}
              style={{
                top: node.y,
                left: node.x,
                borderLeft: `4px solid ${sentimentBorderColor[node.sentiment]}`,
              }}
            >
              <div className="flex justify-between items-start mb-1 gap-1">
                <span className="text-sm font-semibold text-text-base truncate max-w-[110px] font-heading">{node.name}</span>
                <span
                  className={`text-[10px] font-mono px-1 border rounded shrink-0 ${sentimentScoreClasses[node.sentiment]}`}
                >
                  {node.score}
                </span>
              </div>
              <div className="text-xs text-text-muted truncate">{node.title}</div>
            </div>
          ))}
        </div>

        <div className="absolute top-6 left-6 pointer-events-none">
          <span className="inline-flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded text-[11px] font-mono uppercase tracking-wide text-text-secondary shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-muted opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-muted" />
            </span>
            Live Sync: Active
          </span>
        </div>

        <div className="absolute bottom-6 right-6 flex bg-surface border border-border rounded overflow-hidden shadow-sm pointer-events-auto">
          <button type="button" className="p-2 hover:bg-surface-muted border-r border-border text-text-muted">
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
          <button type="button" className="p-2 hover:bg-surface-muted border-r border-border text-text-muted">
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
          <button type="button" className="p-2 hover:bg-surface-muted text-text-muted">
            <span className="material-symbols-outlined text-lg">fit_screen</span>
          </button>
        </div>
      </div>

      <aside className="w-[320px] shrink-0 bg-surface border-l border-border flex flex-col min-h-0 overflow-hidden">
        {selectedNode ? (
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="p-5 border-b border-border flex justify-between items-start gap-2">
              <div className="flex gap-3 min-w-0">
                <div className="w-10 h-10 bg-surface-subtle border border-border rounded flex items-center justify-center font-heading font-bold text-brand shrink-0">
                  {selectedNode.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-text-base truncate">{selectedNode.name}</p>
                  <p className="text-xs text-text-muted truncate">{selectedNode.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="text-text-muted hover:text-text-base p-1 shrink-0"
                aria-label="Close panel"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4 border-b border-border">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Rel Score</p>
                <p className="font-heading text-2xl font-semibold text-brand-muted tracking-tight mt-1">{selectedNode.score}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Role Type</p>
                <p className="font-heading text-lg font-semibold text-text-base tracking-tight mt-1">{roleTypeLabel}</p>
              </div>
            </div>

            <div className="p-5 flex-1">
              <h3 className="font-heading font-semibold text-sm text-text-base mb-4">Contact History</h3>
              <div className="border-l border-border ml-2 pl-4 space-y-6">
                {CONTACT_HISTORY.map((item) => (
                  <div key={item.id} className="relative">
                    <span
                      className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full border-2 border-surface ${dotClass(item.dot)}`}
                    />
                    <p className="font-mono text-[11px] text-text-muted">{item.date}</p>
                    <p className="text-sm font-medium text-text-base mt-1">{item.title}</p>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 border-t border-border mt-auto">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-2">
                Internal Notes
              </label>
              <textarea
                className="w-full min-h-[80px] border border-border rounded p-3 text-sm text-text-base bg-surface-subtle resize-y focus:outline-none focus:border-brand"
                placeholder="Add context for your team..."
              />
              <button
                type="button"
                className="mt-3 w-full py-2 bg-brand text-white text-sm font-heading font-semibold rounded hover:bg-[#166534] transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-text-muted text-sm">Select a node on the map to view details.</div>
        )}
      </aside>
    </div>
  )
}
