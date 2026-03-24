import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { OnboardingLayout } from '../OnboardingLayout'

function Wrapper() {
  return (
    <MemoryRouter initialEntries={['/onboarding/step-1']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingLayout />}>
          <Route path="step-1" element={<div>Step 1 Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

test('renders RECONN.ONE wordmark', () => {
  render(<Wrapper />)
  expect(screen.getAllByText('RECONN.ONE').length).toBeGreaterThan(0)
})

test('renders all 4 onboarding nav items', () => {
  render(<Wrapper />)
  expect(screen.getByText('Product Context')).toBeInTheDocument()
  expect(screen.getByText('Target Personas')).toBeInTheDocument()
  expect(screen.getByText('ICP Definition')).toBeInTheDocument()
  expect(screen.getByText('Growth Goals')).toBeInTheDocument()
})

test('renders child route content via Outlet', () => {
  render(<Wrapper />)
  expect(screen.getByText('Step 1 Content')).toBeInTheDocument()
})
