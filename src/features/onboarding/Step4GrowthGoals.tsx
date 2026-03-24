import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProTipCallout } from '../../components/ProTipCallout'

const allMarkets = [
  { id: 'north-america', label: 'North America' },
  { id: 'western-europe', label: 'Western Europe' },
  { id: 'southeast-asia', label: 'Southeast Asia' },
  { id: 'middle-east', label: 'Middle East' },
  { id: 'nordic-region', label: 'Nordic Region' },
]

export function Step4GrowthGoals() {
  const [shortTermGoal, setShortTermGoal] = useState('')
  const [annualGoal, setAnnualGoal] = useState('')
  const [activeMarkets, setActiveMarkets] = useState<string[]>(['north-america', 'western-europe'])
  const navigate = useNavigate()

  const toggleMarket = (id: string) =>
    setActiveMarkets((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase px-3 py-1 bg-brand-light text-brand rounded-full">
            Step 4 of 4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-3 font-sans">What are your primary objectives?</h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          Define the specific milestones that will measure the success of your Intelligence integration.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Form Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Timeline-Based Goals */}
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-brand">timer</span>
              <h2 className="text-lg font-bold text-text-base font-sans">Timeline-Based Goals</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-text-muted mb-2 font-sans">
                  Short-term Goal (Q1–Q2)
                </label>
                <input
                  type="text"
                  value={shortTermGoal}
                  onChange={(e) => setShortTermGoal(e.target.value)}
                  placeholder="e.g., Close 15 CPO accounts in Q2"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none bg-surface-subtle placeholder:text-slate-400 font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-text-muted mb-2 font-sans">
                  Long-term Goal (Annual)
                </label>
                <input
                  type="text"
                  value={annualGoal}
                  onChange={(e) => setAnnualGoal(e.target.value)}
                  placeholder="e.g., Become preferred vendor for Tesla-certified installers"
                  className="w-full px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none bg-surface-subtle placeholder:text-slate-400 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Priority Markets */}
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-brand">public</span>
              <h2 className="text-lg font-bold text-text-base font-sans">Priority Markets</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {allMarkets.map((market) => {
                const active = activeMarkets.includes(market.id)
                return (
                  <button
                    key={market.id}
                    onClick={() => toggleMarket(market.id)}
                    className={`px-4 py-2 font-bold text-xs rounded-full border flex items-center gap-2 transition-colors font-sans ${
                      active
                        ? 'bg-brand-light text-brand border-brand/20'
                        : 'bg-surface-muted text-text-muted border-border hover:bg-surface-strong'
                    }`}
                  >
                    {market.label}
                    <span className="material-symbols-outlined text-[16px]">
                      {active ? 'close' : 'add'}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for additional markets..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none bg-surface-subtle font-sans"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-8">
            <button
              onClick={() => navigate('/onboarding/step-3')}
              className="flex items-center gap-2 text-text-muted font-bold hover:text-brand transition-colors font-sans"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back
            </button>
            <button
              onClick={() => navigate('/crm/dashboard')}
              className="px-8 py-4 bg-brand text-white font-black rounded-lg shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-3 font-sans"
            >
              Complete Onboarding
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                rocket_launch
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ProTipCallout
            title="Pro Tip: Smart Goals"
            body="Our data shows that organizations with specific 90-day targets see 40% higher platform adoption rates. Try to be as numerical as possible."
          />

          {/* Market Projection */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h4 className="text-xs font-bold tracking-widest uppercase text-text-muted mb-6 font-sans">Market Projection</h4>
            <div className="aspect-video bg-surface-muted rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-end p-4 gap-2">
                {[40, 55, 48, 70, 62, 80, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-brand/20 rounded-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-slate-400 font-sans">Predicted Velocity</span>
                <span className="text-xs font-bold text-brand font-sans">+12.4%</span>
              </div>
              <div className="w-full bg-surface-muted h-1 rounded-full">
                <div className="bg-brand w-[75%] h-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
