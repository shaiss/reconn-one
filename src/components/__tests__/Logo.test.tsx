import { render, screen } from '@testing-library/react'
import { Logo } from '../Logo'

test('renders wordmark text', () => {
  render(<Logo />)
  expect(screen.getByText('RECONN.ONE')).toBeInTheDocument()
})

test('renders svg mark', () => {
  const { container } = render(<Logo />)
  expect(container.querySelector('svg')).toBeInTheDocument()
})
