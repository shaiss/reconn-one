interface LogoProps {
  size?: 'sm' | 'md'
  variant?: 'dark' | 'light'
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const iconSize = size === 'sm' ? 20 : 28
  const textSize = size === 'sm' ? 'text-sm' : 'text-lg'
  const color = variant === 'light' ? 'text-white' : 'text-brand'

  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="3" cy="21" r="1.5" fill="currentColor"/>
        <path d="M 10 21 A 7 7 0 0 0 3 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M 16 21 A 13 13 0 0 0 3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
      <span className={`${textSize} font-black tracking-tighter uppercase font-sans`}>
        RECONN.ONE
      </span>
    </div>
  )
}
