import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDossierByAccountSlug } from '@/lib/appDb.ts'
import type { DossierPayload, DossierSentiment } from '@/lib/dossierTypes.ts'

const sentimentStakeholderBorder: Record<DossierSentiment, string> = {
  positive: '3px solid #22C55E',
  neutral: '3px solid #EAB308',
  negative: '3px solid #B91C1C',
}

export function DealReadyDossier() {
  const { accountId = '' } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const [dossier, setDossier] = useState<DossierPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void (async () => {
      try {
        const data = await getDossierByAccountSlug(accountId)
        if (!cancelled) setDossier(data)
      } catch {
        if (!cancelled) setDossier(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [accountId])

  const copyTrack = useCallback(async () => {
    const text = dossier?.talkTrack
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [dossier?.talkTrack])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 font-body">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
          <p className="text-sm font-mono uppercase tracking-widest">Loading dossier…</p>
        </div>
      </div>
    )
  }

  if (!dossier) {
    return (
      <div className="flex-1 p-6 max-w-lg mx-auto w-full font-body">
        <div className="bg-surface border border-border rounded p-8 text-center">
          <span className="material-symbols-outlined text-text-muted text-4xl mb-4 block">folder_off</span>
          <h2 className="font-heading font-semibold text-text-base text-lg">No dossier on file</h2>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">
            There is no deal-ready dossier for account{' '}
            <span className="font-mono text-text-secondary">{accountId || '(unknown)'}</span>. Try another account from
            the list.
          </p>
          <p className="text-xs text-text-muted mt-4 leading-relaxed text-left border-t border-border pt-4">
            <span className="font-mono text-[10px] uppercase tracking-wider">Note:</span> Ctrl+Shift+R only reloads the
            page — it does not clear saved SQLite data. To reset the in-browser database (personas + dossiers), open
            DevTools → Application → Local Storage → remove the key{' '}
            <span className="font-mono text-text-secondary">reconn-one-sqlite-v1</span>.
          </p>
          <Link
            to="/crm/accounts"
            className="inline-flex mt-6 px-4 py-2 bg-brand text-white text-sm font-heading font-semibold rounded hover:bg-[#166534] transition-colors"
          >
            Browse accounts
          </Link>
        </div>
      </div>
    )
  }

  const badge = dossier.whyNowBadge ?? 'High Intent'

  return (
    <div className="flex-1 p-6 max-w-[1600px] mx-auto w-full overflow-y-auto font-body">
      {dossier.displayName && (
        <p className="text-sm text-text-muted font-body mb-4">
          <span className="font-heading font-semibold text-text-base">{dossier.displayName}</span>
          <span className="text-text-muted"> · Deal-ready dossier</span>
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border p-5 rounded relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
            <h3 className="font-heading font-semibold text-text-base flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-brand text-xl">domain</span>
              Firmographics
            </h3>
            <dl className="space-y-3">
              {dossier.firmographics.map((row) => (
                <div key={row.label}>
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{row.label}</dt>
                  <dd className="text-sm text-text-base font-medium mt-0.5">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {dossier.techStack.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] px-2 py-1 bg-surface-subtle border border-border rounded text-text-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-5 rounded">
            <h3 className="font-heading font-semibold text-text-base flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-text-muted text-xl">newspaper</span>
              Recent News
            </h3>
            <ul className="divide-y divide-border">
              {dossier.news.map((item) => (
                <li key={item.id} className="py-3 first:pt-0">
                  <p className="font-mono text-xs text-text-muted mb-1">{item.age}</p>
                  <p className="text-sm text-text-base leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />
            <div className="p-6 pt-7">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className="material-symbols-outlined text-brand-muted text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                <h3 className="font-heading font-semibold text-text-base text-lg tracking-tight">Why NOW</h3>
                <span className="text-[10px] font-bold uppercase tracking-wide bg-brand-light text-brand border border-brand-light px-2 py-1 rounded">
                  {badge}
                </span>
              </div>
              <ul className="space-y-4">
                {dossier.whyNowSignals.map((s) => (
                  <li key={s.id} className="flex gap-3">
                    <span className="material-symbols-outlined text-brand shrink-0 text-xl">check_circle</span>
                    <p className="text-sm text-text-base leading-relaxed">
                      <span className="font-semibold">{s.lead}</span> {s.body}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-8 bg-surface-subtle border border-border p-4 rounded relative">
                <span className="inline-block text-[10px] font-mono uppercase tracking-widest bg-surface border border-border px-2 py-1 rounded mb-3">
                  EVR Recommended Talk Track
                </span>
                <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono leading-relaxed pr-24">
                  {dossier.talkTrack}
                </pre>
                <button
                  type="button"
                  onClick={() => void copyTrack()}
                  className="absolute top-4 right-4 bg-brand text-white text-xs font-heading font-semibold px-3 py-2 rounded hover:bg-[#166534] transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy Track'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 rounded">
            <h3 className="font-heading font-semibold text-text-base mb-4">Objection Handling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dossier.objections.map((o) => (
                <div key={o.id} className="border border-border p-4 rounded bg-surface-subtle/50">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-danger mb-2">Potential Blocker</p>
                  <p className="text-sm font-medium text-text-base mb-3">{o.blocker}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{o.response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border p-5 rounded relative">
            <h3 className="font-heading font-semibold text-text-base mb-6">Buying Committee</h3>
            <div className="absolute left-4 top-14 bottom-24 w-px bg-border hidden sm:block" aria-hidden />
            <ul className="space-y-4 relative">
              {dossier.stakeholders.map((s) => (
                <li
                  key={s.id}
                  className={`relative z-10 flex items-start gap-3 bg-surface border border-border p-3 rounded ${s.indented ? 'ml-6' : ''}`}
                  style={{ borderLeft: sentimentStakeholderBorder[s.sentiment] }}
                >
                  <div className="w-8 h-8 rounded-full bg-surface-muted border border-border flex items-center justify-center text-[10px] font-bold text-text-secondary shrink-0">
                    {s.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      <p className="font-heading font-semibold text-sm text-text-base">{s.name}</p>
                      {s.champion && (
                        <span
                          className="material-symbols-outlined text-brand-muted text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{s.title}</p>
                    <p className="text-[10px] font-mono uppercase tracking-wide text-text-muted mt-2">{s.role}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigate(`/crm/map/${accountId}`)}
              className="w-full mt-6 py-3 bg-brand text-white font-heading font-semibold text-sm rounded hover:bg-[#166534] transition-colors"
            >
              View Full Map
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
