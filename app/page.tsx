import Link from 'next/link'
import Image from 'next/image'
import {
  CalendarDays,
  RefreshCcw,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LandingHeader } from '@/components/landing/landing-header'

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Calendar-first budgeting',
    description:
      'See every income and expense laid out on a monthly calendar so you always know what hits your account and when.',
  },
  {
    icon: RefreshCcw,
    title: 'Recurring transactions',
    description:
      'Set up rent, subscriptions, and paychecks once. Lumi keeps them on schedule month after month.',
  },
  {
    icon: TrendingUp,
    title: 'Spending insights',
    description:
      'Understand where your money goes with clear breakdowns of income, expenses, and your monthly net.',
  },
  {
    icon: ShieldCheck,
    title: 'Private and secure',
    description:
      'Your account is protected with secure authentication. Your budget stays yours alone.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-income" />
                Personal budgeting, reimagined
              </span>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                See your money on a calendar you actually understand
              </h1>
              <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                Lumi turns your income and expenses into a clear monthly view.
                Plan ahead, track what&apos;s paid, and always know your balance
                at a glance.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">
                    Get started free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/auth/login">Log in</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
                <Image
                  src="/images/lumi-dashboard-preview.png"
                  alt="Lumi dashboard showing a monthly budget calendar with income and expenses"
                  width={1200}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Everything you need to stay on top of your money
              </h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                Simple tools that make budgeting feel effortless instead of
                overwhelming.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-12 text-center md:py-16">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Start budgeting smarter today
            </h2>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Create your free account and bring clarity to your finances in
              minutes.
            </p>
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Create your account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/images/lumi-logo.png"
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-foreground">Lumi</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lumi. Monthly budget tracker.
          </p>
        </div>
      </footer>
    </div>
  )
}
