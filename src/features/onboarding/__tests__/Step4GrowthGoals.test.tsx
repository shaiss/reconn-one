import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step4GrowthGoals } from '../Step4GrowthGoals'

test('renders heading', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText('What are your primary objectives?')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText('Step 4 of 4')).toBeInTheDocument()
})

test('renders timeline goal inputs', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText('Timeline-Based Goals')).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/e.g., Close 15 CPO accounts/i)).toBeInTheDocument()
})

test('renders complete onboarding button', () => {
  render(<MemoryRouter><Step4GrowthGoals /></MemoryRouter>)
  expect(screen.getByText(/Complete Onboarding/i)).toBeInTheDocument()
})
