import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProTipCallout } from '../../components/ProTipCallout'

const geoRegions = ['Northeast', 'Southeast', 'Midwest', 'Southwest', 'West Coast', 'Northwest']

const companyTypes = ['Utility', 'Municipal', 'Commercial', 'Industrial']

const siteTypes = [
  { id: 'retail', label: 'Retail' },
  { id: 'workplace', label: 'Workplace' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'highway', label: 'Highway Corridor' },
]

export function Step3ICPDefinition() {
  const [geoSelected, setGeoSelected] = useState<string[]>(['Northeast', 'Southeast'])
  const [companyType, setCompanyType] = useState('Utility')
  const [siteType, setSiteType] = useState('retail')
  const [scoreThreshold, setScoreThreshold] = useState(82)
  const navigate = useNavigate()

  const toggleGeo = (region: string) =>
    setGeoSelected((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    )

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase px-3 py-1 bg-brand-light text-brand rounded-full">
            Step 3 of 4
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-text-base mb-3 font-sans">Define your Ideal Customer Profile</h1>
        <p className="text-text-muted text-lg max-w-2xl font-sans">
          Set the parameters for your ideal market segment. This configuration informs the AI on how to prioritize signals and score potential leads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">

          {/* Geography */}
          <section className="bg-white p-8 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-brand">map</span>
              <h3 className="text-xl font-bold text-text-base font-sans">Geography</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {geoRegions.map((region) => (
                <label
                  key={region}
                  className="relative flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand transition-colors cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={geoSelected.includes(region)}
                    onChange={() => toggleGeo(region)}
                    className="w-5 h-5 text-brand border-slate-300 rounded focus:ring-brand"
                  />
                  <span className="text-sm font-medium text-text-muted group-hover:text-text-base font-sans">{region}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Company Type + Site Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Type */}
            <section className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-brand">business</span>
                <h3 className="text-xl font-bold text-text-base font-sans">Company Type</h3>
              </div>
              <div className="space-y-3">
                {companyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setCompanyType(type)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border font-semibold text-sm transition-colors font-sans ${
                      companyType === type
                        ? 'border-brand bg-brand-light/10 text-brand'
                        : 'border-border hover:bg-surface-subtle text-text-muted'
                    }`}
                  >
                    {type}
                    {companyType === type && (
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Site Type */}
            <section className="bg-white p-8 rounded-xl border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-brand">location_on</span>
                <h3 className="text-xl font-bold text-text-base font-sans">Site Type</h3>
              </div>
              <div className="space-y-3">
                {siteTypes.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg border border-border cursor-pointer hover:bg-surface-subtle transition-colors"
                  >
                    <span className="text-sm font-medium text-text-base font-sans">{st.label}</span>
                    <input
                      type="radio"
                      name="site_type"
                      value={st.id}
                      checked={siteType === st.id}
                      onChange={() => setSiteType(st.id)}
                      className="text-brand focus:ring-brand"
                    />
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Score Threshold */}
          <section className="bg-white p-8 rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand">signal_cellular_alt</span>
                <h3 className="text-xl font-bold text-text-base font-sans">Minimum Score Threshold</h3>
              </div>
              <span className="bg-brand text-white font-bold px-3 py-1 rounded-lg text-lg">{scoreThreshold}</span>
            </div>
            <div className="relative w-full h-12 flex items-center">
              <div className="absolute w-full h-2 bg-surface-muted rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full" style={{ width: `${scoreThreshold}%` }} />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(Number(e.target.value))}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer accent-brand focus:outline-none"
              />
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest font-sans">Broad Reach</span>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest font-sans">High Quality</span>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Impact Projection */}
          <div className="bg-brand p-8 rounded-xl text-white overflow-hidden relative group">
            <span
              className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12 transition-transform group-hover:scale-110"
            >
              insights
            </span>
            <h4 className="text-lg font-bold mb-2 font-sans">Impact Projection</h4>
            <p className="text-emerald-100/80 text-sm mb-6 leading-relaxed font-sans">
              Based on these filters, our intelligence engine has identified:
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2">
                <span className="text-sm font-medium text-emerald-200 font-sans">Total Sites</span>
                <span className="text-2xl font-bold font-sans">14,282</span>
              </div>
              <div className="flex items-center justify-between border-b border-emerald-800/50 pb-2">
                <span className="text-sm font-medium text-emerald-200 font-sans">High Score Leads</span>
                <span className="text-2xl font-bold font-sans">1,405</span>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-bold bg-emerald-800/40 w-fit px-3 py-1.5 rounded-full font-sans">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              94% MATCH ACCURACY
            </div>
          </div>

          {/* Pro Tip */}
          <ProTipCallout
            title="Intelligence Pro-Tip"
            body={`Setting a threshold above 80 typically yields conversion rates 3x higher than industry average, but restricts total volume. For expansion phases, we recommend 65–75.`}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-border flex items-center justify-between">
        <button
          onClick={() => navigate('/onboarding/step-2')}
          className="flex items-center gap-2 px-6 py-3 text-text-muted font-bold hover:text-text-base transition-colors font-sans"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button
          onClick={() => navigate('/onboarding/step-4')}
          className="px-10 py-3 bg-brand text-white font-bold rounded-lg shadow-lg hover:bg-emerald-800 transition-all font-sans"
        >
          Continue to Growth Goals
        </button>
      </footer>
    </div>
  )
}
