import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand/10">
              <Image
                src="/images/lumi-logo.png"
                alt="Lumi logo"
                width={32}
                height={32}
                className="size-8 object-cover"
              />
            </span>
            <span className="font-semibold text-foreground tracking-tight text-lg">
              Lumi
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
