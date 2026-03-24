import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step2TargetPersonas } from '../Step2TargetPersonas'

test('renders heading', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText('Who do you sell to?')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
})

test('renders persona cards', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText('Procurement Managers')).toBeInTheDocument()
  expect(screen.getByText('Site Developers')).toBeInTheDocument()
  expect(screen.getByText('Fleet Operations')).toBeInTheDocument()
  expect(screen.getByText('Sustainability Officers')).toBeInTheDocument()
  expect(screen.getByText('Capital Partners')).toBeInTheDocument()
})

test('renders continue button', () => {
  render(<MemoryRouter><Step2TargetPersonas /></MemoryRouter>)
  expect(screen.getByText(/Continue to ICP/i)).toBeInTheDocument()
})
