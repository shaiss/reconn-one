import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step1ProductContext } from '../Step1ProductContext'

test('renders step heading', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText('Product Context')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText('Step 1 of 4')).toBeInTheDocument()
})

test('renders all product type options', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText('Hardware (Chargers, Connectors)')).toBeInTheDocument()
  expect(screen.getByText('Software (OCPP, Network Mgmt)')).toBeInTheDocument()
  expect(screen.getByText('Capital / Financing')).toBeInTheDocument()
})

test('renders continue button', () => {
  render(<MemoryRouter><Step1ProductContext /></MemoryRouter>)
  expect(screen.getByText(/Continue to Personas/i)).toBeInTheDocument()
})
