import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, vi } from 'vitest'
import { Step2TargetPersonas } from '../Step2TargetPersonas'

vi.mock('@/lib/appDb', () => ({
  listCustomPersonas: vi.fn(() => Promise.resolve([])),
  insertCustomPersona: vi.fn(),
  deleteCustomPersona: vi.fn(),
}))

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  })
})

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

test('add custom persona opens dialog', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <Step2TargetPersonas />
    </MemoryRouter>
  )
  const addBtn = screen.getByRole('button', { name: /add custom persona/i })
  await waitFor(() => expect(addBtn).not.toBeDisabled())
  await user.click(addBtn)
  expect(screen.getByRole('heading', { name: /custom persona/i })).toBeInTheDocument()
})
