import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProTipCallout } from '../../components/ProTipCallout'

const options = [
  { id: 'hardware', icon: 'ev_charger', label: 'Hardware (Chargers, Connectors)', desc: 'Physical infrastructure deployment including Level 2 and DC Fast Charging units and auxiliary components.' },
  { id: 'software', icon: 'developer_board', label: 'Software (OCPP, Network Mgmt)', desc: 'Cloud-based platforms for charger monitoring, load balancing, and automated billing protocols.' },
  { id: 'epc', icon: 'construction', label: 'EPC / Installation Services', desc: 'End-to-end Engineering, Procurement, and Construction for utility-scale or commercial EV sites.' },
  { id: 'maintenance', icon: 'build', label: 'Service & Maintenance', desc: 'Ongoing operational support, preventive maintenance, and rapid response hardware repair.' },
  { id: 'financing', icon: 'account_balance', label: 'Capital / Financing', desc: 'Asset financing, leasing programs, and capital expenditure planning for fleet electrification.', wide: true },
]

export function Step1ProductContext() {
  const [selected, setSelected] = useState('hardware')
  const navigate = useNavigate()

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase px-3 py-1 bg-brand-light text-brand rounded-full">
            Step 1 of 4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-3 font-sans">Product Context</h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          Define your core commercial offering to align our intelligence engine with your business model.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-border">
        <h2 className="text-xl font-bold text-text-base mb-8 flex items-center gap-2 font-sans">
          <span className="w-2 h-8 bg-brand rounded-full" />
          What do you sell?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt) => (
            <label
              key={opt.id}
              className={`relative block cursor-pointer p-6 bg-white border-2 rounded-xl transition-all hover:border-brand-light ${
                opt.wide ? 'md:col-span-2 flex items-center gap-6' : ''
              } ${selected === opt.id ? 'border-brand bg-brand-light/10' : 'border-border'}`}
            >
              <input
                type="radio"
                name="product_type"
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => setSelected(opt.id)}
                className="hidden"
              />
              <div className={`p-3 bg-surface-subtle rounded-lg shrink-0 ${opt.wide ? '' : 'mb-4'}`}>
                <span className="material-symbols-outlined text-2xl text-text-muted">{opt.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-text-base mb-2 font-sans">{opt.label}</h3>
                <p className="text-sm text-text-muted leading-relaxed font-sans">{opt.desc}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                opt.wide ? '' : 'absolute top-6 right-6'
              } ${selected === opt.id ? 'border-brand bg-brand' : 'border-border'}`}>
                {selected === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Pro Tip */}
      <div className="mt-8">
        <ProTipCallout
          body="Choosing 'Hardware' will unlock specific logistics and supply chain analytical models in the Growth Goals phase."
        />
      </div>

      {/* Footer */}
      <div className="mt-12 flex justify-between items-center">
        <button className="px-6 py-3 text-text-muted font-semibold flex items-center gap-2 hover:text-text-base transition-colors font-sans">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back
        </button>
        <button
          onClick={() => navigate('/onboarding/step-2')}
          className="px-8 py-3 bg-brand text-white rounded-lg font-bold shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-3 font-sans"
        >
          Continue to Personas
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  )
}
