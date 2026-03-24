import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CRMLayout } from '../CRMLayout'

function Wrapper() {
  return (
    <MemoryRouter initialEntries={['/crm/dashboard']}>
      <Routes>
        <Route path="/crm" element={<CRMLayout />}>
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

test('renders RECONN.ONE wordmark', () => {
  render(<Wrapper />)
  expect(screen.getAllByText('RECONN.ONE').length).toBeGreaterThan(0)
})

test('renders all CRM nav items', () => {
  render(<Wrapper />)
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
  expect(screen.getByText('Accounts')).toBeInTheDocument()
  expect(screen.getByText('Deals')).toBeInTheDocument()
})

test('renders child route content via Outlet', () => {
  render(<Wrapper />)
  expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
})
