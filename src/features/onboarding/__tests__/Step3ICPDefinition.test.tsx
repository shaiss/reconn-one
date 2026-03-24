import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Step3ICPDefinition } from '../Step3ICPDefinition'

test('renders heading', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Define your Ideal Customer Profile')).toBeInTheDocument()
})

test('renders step indicator', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Step 3 of 4')).toBeInTheDocument()
})

test('renders geography section', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Geography')).toBeInTheDocument()
  expect(screen.getByText('Northeast')).toBeInTheDocument()
})

test('renders impact projection card', () => {
  render(<MemoryRouter><Step3ICPDefinition /></MemoryRouter>)
  expect(screen.getByText('Impact Projection')).toBeInTheDocument()
})
