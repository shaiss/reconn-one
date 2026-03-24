import { render, screen } from '@testing-library/react'
import { ScoreBadge } from '../ScoreBadge'

test('renders score value', () => {
  render(<ScoreBadge score={92} />)
  expect(screen.getByText('92')).toBeInTheDocument()
})

test('applies positive classes for score >= 80', () => {
  const { container } = render(<ScoreBadge score={85} />)
  const el = container.firstChild as HTMLElement
  expect(el.className).toContain('score-positive')
})

test('applies neutral classes for score < 80', () => {
  const { container } = render(<ScoreBadge score={67} />)
  const el = container.firstChild as HTMLElement
  expect(el.className).toContain('score-neutral')
})
