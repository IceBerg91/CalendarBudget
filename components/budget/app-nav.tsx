'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, RefreshCcw, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Calendar', icon: CalendarDays },
  { href: '/recurring', label: 'Recurring', icon: RefreshCcw },
  { href: '/insights', label: 'Insights', icon: TrendingDown },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full overflow-hidden bg-brand/10 flex items-center justify-center">
              <Image
                src="/images/lumi-logo.png"
                alt="Lumi logo"
                width={32}
                height={32}
                className="size-8 object-cover"
              />
            </div>
            <span className="font-semibold text-foreground tracking-tight">Lumi</span>
          </div>

          {/* Nav links */}
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-brand'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
