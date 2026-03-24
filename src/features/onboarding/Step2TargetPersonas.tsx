import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const personas = [
  { id: 'procurement', icon: 'inventory_2', label: 'Procurement Managers', desc: 'CPOs and hardware leads managing vendor selection for charging stations and grid hardware.' },
  { id: 'developers', icon: 'location_city', label: 'Site Developers', desc: 'Leads for NEVI-funded projects, corridor buildouts, and commercial real estate electrification.' },
  { id: 'fleet', icon: 'local_shipping', label: 'Fleet Operations', desc: 'Logistics managers transitioning medium and heavy-duty vehicles to electric power systems.' },
  { id: 'sustainability', icon: 'eco', label: 'Sustainability Officers', desc: 'ESG executives focused on Scope 2 and 3 emissions, carbon tracking, and compliance.' },
  { id: 'capital', icon: 'account_balance', label: 'Capital Partners', desc: 'Project finance firms and lenders providing the debt/equity for large scale infrastructure.' },
]

export function Step2TargetPersonas() {
  const [selected, setSelected] = useState<string[]>(['developers'])
  const navigate = useNavigate()

  const toggle = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

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
          ReconnOne optimizes your outreach by mapping your product value to specific stakeholders in the EV infrastructure ecosystem. Select all that apply.
        </p>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {personas.map((p) => {
          const active = selected.includes(p.id)
          return (
            <label
              key={p.id}
              className={`cursor-pointer group relative bg-white border-2 rounded-xl p-6 transition-all hover:shadow-md ${
                active ? 'border-brand bg-brand/5' : 'border-border hover:border-brand-light'
              }`}
            >
              <input type="checkbox" className="hidden" checked={active} onChange={() => toggle(p.id)} />
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-light/30 text-brand rounded-lg">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'bg-brand border-brand' : 'border-border'}`}>
                  {active && <span className="material-symbols-outlined text-[12px] text-white">check</span>}
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-base mb-2 font-sans">{p.label}</h3>
              <p className="text-sm text-text-muted leading-relaxed font-sans">{p.desc}</p>
            </label>
          )
        })}

        {/* Add Custom */}
        <button className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-text-muted hover:border-brand-muted hover:text-brand hover:bg-brand-light/10 transition-all">
          <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
          <span className="font-bold text-xs uppercase tracking-widest font-sans">Add Custom Persona</span>
        </button>
      </div>

      {/* Pro Tip */}
      <div className="bg-surface-muted rounded-xl p-8 mb-12 flex items-start gap-6 relative overflow-hidden">
        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-brand/5 rotate-12 select-none" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
        <div className="p-3 bg-white text-brand rounded-lg shadow-sm shrink-0">
          <span className="material-symbols-outlined">tips_and_updates</span>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-2 font-sans">Intelligence Pro Tip</p>
          <h4 className="text-lg font-bold text-text-base mb-2 font-sans">Multi-Stakeholder Mapping</h4>
          <p className="text-sm text-text-muted max-w-xl leading-relaxed font-sans">
            Infrastructure deals often require buy-in from multiple personas. ReconnOne's AI-driven intelligence engine can sequence multi-channel outreach to hit both procurement and finance teams simultaneously to accelerate deal cycles.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-8 border-t border-border">
        <button onClick={() => navigate('/onboarding/step-1')} className="flex items-center gap-2 px-6 py-3 font-bold text-text-secondary hover:text-brand transition-colors font-sans">
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button onClick={() => navigate('/onboarding/step-3')} className="px-8 py-3 bg-brand text-white font-bold rounded-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-3 font-sans">
          Continue to ICP Definition
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
