import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteCustomPersona,
  insertCustomPersona,
  listCustomPersonas,
  type CustomPersonaRow,
} from '@/lib/appDb'

const BUILTIN_PERSONAS = [
  {
    id: 'procurement',
    icon: 'inventory_2',
    label: 'Procurement Managers',
    desc: 'CPOs and hardware leads managing vendor selection for charging stations and grid hardware.',
  },
  {
    id: 'developers',
    icon: 'location_city',
    label: 'Site Developers',
    desc: 'Leads for NEVI-funded projects, corridor buildouts, and commercial real estate electrification.',
  },
  {
    id: 'fleet',
    icon: 'local_shipping',
    label: 'Fleet Operations',
    desc: 'Logistics managers transitioning medium and heavy-duty vehicles to electric power systems.',
  },
  {
    id: 'sustainability',
    icon: 'eco',
    label: 'Sustainability Officers',
    desc: 'ESG executives focused on Scope 2 and 3 emissions, carbon tracking, and compliance.',
  },
  {
    id: 'capital',
    icon: 'account_balance',
    label: 'Capital Partners',
    desc: 'Project finance firms and lenders providing the debt/equity for large scale infrastructure.',
  },
] as const

const ICON_CHOICES = [
  { value: 'person', label: 'Person' },
  { value: 'groups', label: 'Groups' },
  { value: 'business_center', label: 'Business' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'handshake', label: 'Partnership' },
  { value: 'psychology', label: 'Stakeholder' },
] as const

type PersonaItem = {
  id: string
  icon: string
  label: string
  desc: string
  isCustom: boolean
}

export function Step2TargetPersonas() {
  const [selected, setSelected] = useState<string[]>(['developers'])
  const [customPersonas, setCustomPersonas] = useState<CustomPersonaRow[]>([])
  const [dbReady, setDbReady] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newIcon, setNewIcon] = useState<string>(ICON_CHOICES[0].value)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    listCustomPersonas()
      .then((rows) => {
        if (!cancelled) setCustomPersonas(rows)
      })
      .catch(() => {
        if (!cancelled) setCustomPersonas([])
      })
      .finally(() => {
        if (!cancelled) setDbReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const allPersonas: PersonaItem[] = [
    ...BUILTIN_PERSONAS.map((p) => ({ ...p, isCustom: false })),
    ...customPersonas.map((p) => ({
      id: p.id,
      icon: p.icon,
      label: p.label,
      desc: p.description,
      isCustom: true,
    })),
  ]

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const openDialog = () => {
    setFormError(null)
    setNewLabel('')
    setNewDescription('')
    setNewIcon(ICON_CHOICES[0].value)
    dialogRef.current?.showModal()
  }

  const closeDialog = () => {
    dialogRef.current?.close()
  }

  const handleAddCustom = useCallback(async () => {
    const label = newLabel.trim()
    const description = newDescription.trim()
    if (!label || !description) {
      setFormError('Add a name and a short description for this persona.')
      return
    }
    setFormError(null)
    try {
      const row = await insertCustomPersona({ label, description, icon: newIcon })
      setCustomPersonas((prev) => [...prev, row])
      setSelected((prev) => (prev.includes(row.id) ? prev : [...prev, row.id]))
      closeDialog()
    } catch {
      setFormError('Could not save this persona. Try again.')
    }
  }, [newDescription, newIcon, newLabel])

  const handleRemoveCustom = useCallback(async (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteCustomPersona(id)
      setCustomPersonas((prev) => prev.filter((p) => p.id !== id))
      setSelected((prev) => prev.filter((x) => x !== id))
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase px-3 py-1 bg-brand-light text-brand rounded-full">
            Step 2 of 4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-3 font-sans">Who do you sell to?</h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          ReconnOne optimizes your outreach by mapping your product value to specific stakeholders in the EV infrastructure
          ecosystem. Select all that apply.
        </p>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {allPersonas.map((p) => {
          const active = selected.includes(p.id)
          return (
            <label
              key={p.id}
              className={`cursor-pointer group relative bg-white border-2 rounded-xl p-6 transition-all hover:shadow-md ${
                active ? 'border-brand bg-brand/5' : 'border-border hover:border-brand-light'
              }`}
            >
              <input type="checkbox" className="hidden" checked={active} onChange={() => toggle(p.id)} />
              <div className="flex justify-between items-start mb-4 gap-2">
                <div className="p-3 bg-brand-light/30 text-brand rounded-lg">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {p.isCustom && (
                    <button
                      type="button"
                      aria-label={`Remove ${p.label}`}
                      className="p-1 rounded-lg text-text-muted hover:text-danger hover:bg-danger-light/30 transition-colors"
                      onClick={(e) => handleRemoveCustom(p.id, e)}
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-brand border-brand' : 'border-border'}`}
                  >
                    {active && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-base mb-2 font-sans">{p.label}</h3>
              <p className="text-sm text-text-muted leading-relaxed font-sans">{p.desc}</p>
            </label>
          )
        })}

        <button
          type="button"
          disabled={!dbReady}
          onClick={openDialog}
          className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-text-muted hover:border-brand-muted hover:text-brand hover:bg-brand-light/10 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
          <span className="font-bold text-xs uppercase tracking-widest font-sans">Add Custom Persona</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="rounded-xl border border-border shadow-xl p-0 max-w-lg w-[calc(100%-2rem)] backdrop:bg-black/40"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDialog()
        }}
        onClose={() => setFormError(null)}
      >
        <form
          method="dialog"
          className="p-6 font-sans"
          onSubmit={(e) => {
            e.preventDefault()
            void handleAddCustom()
          }}
        >
          <h2 className="text-xl font-bold text-text-base mb-1">Custom persona</h2>
          <p className="text-sm text-text-muted mb-6">Saved locally in your browser (SQLite via sql.js).</p>

          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Name</label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-base mb-4 outline-none focus:ring-1 focus:ring-brand focus:border-brand"
            placeholder="e.g. Utility planners"
            autoComplete="off"
          />

          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Description</label>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={3}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-base mb-4 outline-none focus:ring-1 focus:ring-brand focus:border-brand resize-y min-h-[5rem]"
            placeholder="Who they are and how they influence the deal."
          />

          <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2">Icon</label>
          <select
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-text-base mb-4 outline-none focus:ring-1 focus:ring-brand focus:border-brand bg-white"
          >
            {ICON_CHOICES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {formError && <p className="text-sm text-danger mb-4">{formError}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-border font-bold text-text-secondary hover:bg-surface-muted text-sm"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-brand text-white font-bold hover:bg-emerald-800 text-sm">
              Save persona
            </button>
          </div>
        </form>
      </dialog>

      {/* Pro Tip */}
      <div className="bg-surface-muted rounded-xl p-8 mb-12 flex items-start gap-6 relative overflow-hidden">
        <span
          className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-brand/5 rotate-12 select-none"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          lightbulb
        </span>
        <div className="p-3 bg-white text-brand rounded-lg shadow-sm shrink-0">
          <span className="material-symbols-outlined">tips_and_updates</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2 font-sans">Intelligence Pro Tip</p>
          <h4 className="text-lg font-bold text-text-base mb-2 font-sans">Multi-Stakeholder Mapping</h4>
          <p className="text-sm text-text-muted max-w-xl leading-relaxed font-sans">
            Infrastructure deals often require buy-in from multiple personas. ReconnOne&apos;s AI-driven intelligence engine can
            sequence multi-channel outreach to hit both procurement and finance teams simultaneously to accelerate deal
            cycles.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-border">
        <button
          type="button"
          onClick={() => navigate('/onboarding/step-1')}
          className="flex items-center gap-2 px-6 py-3 font-bold text-text-secondary hover:text-brand transition-colors font-sans"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button
          type="button"
          onClick={() => navigate('/onboarding/step-3')}
          className="px-8 py-3 bg-brand text-white font-bold rounded-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-3 font-sans"
        >
          Continue to ICP Definition
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
