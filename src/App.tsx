import { Routes, Route, Navigate } from 'react-router-dom'
import { OnboardingLayout } from './layouts/OnboardingLayout'
import { CRMLayout } from './layouts/CRMLayout'
import { FocusedLayout } from './layouts/FocusedLayout'
import { Step1ProductContext } from './features/onboarding/Step1ProductContext'
import { Step2TargetPersonas } from './features/onboarding/Step2TargetPersonas'
import { Step3ICPDefinition } from './features/onboarding/Step3ICPDefinition'
import { Step4GrowthGoals } from './features/onboarding/Step4GrowthGoals'
import { Dashboard } from './features/crm/Dashboard'
import { IntelligenceFeed } from './features/crm/IntelligenceFeed'
import { AccountList } from './features/crm/AccountList'
import { DealProgression } from './features/crm/DealProgression'
import { Settings } from './features/crm/Settings'
import { DealReadyDossier } from './features/crm/DealReadyDossier'
import { DecisionMakerMap } from './features/crm/DecisionMakerMap'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/step-1" replace />} />

      <Route path="/onboarding" element={<OnboardingLayout />}>
        <Route path="step-1" element={<Step1ProductContext />} />
        <Route path="step-2" element={<Step2TargetPersonas />} />
        <Route path="step-3" element={<Step3ICPDefinition />} />
        <Route path="step-4" element={<Step4GrowthGoals />} />
      </Route>

      <Route path="/crm" element={<CRMLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="feed" element={<IntelligenceFeed />} />
        <Route path="accounts" element={<AccountList />} />
        <Route path="deals" element={<DealProgression />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/crm" element={<FocusedLayout />}>
        <Route path="dossier/:accountId" element={<DealReadyDossier />} />
        <Route path="map/:accountId" element={<DecisionMakerMap />} />
      </Route>
    </Routes>
  )
}
