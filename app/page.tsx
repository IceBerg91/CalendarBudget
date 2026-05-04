import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarDays, TrendingUp, RefreshCcw, ArrowRight, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Calendar View',
    description: 'See all your income and expenses mapped to specific days. Never miss a bill or forget when you get paid.'
  },
  {
    icon: TrendingUp,
    title: 'Spending Insights',
    description: 'Understand where your money goes with visual breakdowns by category and time period.'
  },
  {
    icon: RefreshCcw,
    title: 'Recurring Tracking',
    description: 'Set up recurring expenses and income once. We track them automatically every month.'
  }
]

const BENEFITS = [
  'Track income and expenses on a visual calendar',
  'Set up recurring bills and subscriptions',
  'See your daily, weekly, and monthly balances',
  'Mark transactions as paid or pending',
  'Categorize spending for better insights'
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
              </span>
              Now in Beta - Free to use
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl text-balance">
              Your Budget, Visualized on a Calendar
            </h1>
            
            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-pretty">
              Track your income, expenses, and recurring bills with an intuitive calendar interface. 
              See exactly when money comes in and goes out.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="/auth/login">
                  Log In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything You Need to Manage Your Budget
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful tools to help you understand and control your finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div 
                key={feature.title}
                className="relative bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-6">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Take Control of Your Finances
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                CalendarBudget makes it easy to see your complete financial picture at a glance. 
                No complicated spreadsheets or confusing interfaces.
              </p>
              <ul className="space-y-4">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button asChild size="lg">
                  <Link href="/auth/sign-up">
                    Start Tracking Today
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-3xl flex items-center justify-center">
                <div className="absolute inset-4 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
                  <div className="p-4 border-b border-border bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Image 
                        src="/logo.png" 
                        alt="CalendarBudget" 
                        width={24} 
                        height={24}
                        className="size-6"
                      />
                      <span className="font-semibold text-foreground">May 2026</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground mb-2">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="py-1">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 31 }, (_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm ${
                            i === 3 ? 'bg-income/20 text-income font-medium' :
                            i === 14 ? 'bg-expense/20 text-expense font-medium' :
                            i === 0 ? 'bg-income/20 text-income font-medium' :
                            'hover:bg-muted'
                          }`}
                        >
                          <span>{i + 1}</span>
                          {i === 3 && <span className="text-[8px]">+$2,500</span>}
                          {i === 14 && <span className="text-[8px]">-$150</span>}
                          {i === 0 && <span className="text-[8px]">+$500</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Take Control of Your Budget?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have simplified their financial tracking with CalendarBudget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-base px-8">
              <Link href="/auth/sign-up">
                Create Free Account
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-base px-8 text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/auth/login">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="CalendarBudget" 
                width={32} 
                height={32}
                className="size-8"
              />
              <span className="font-semibold text-foreground">CalendarBudget</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with care for people who want simple budgeting.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
