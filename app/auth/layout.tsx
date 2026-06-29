import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2"
        aria-label="Back to Lumi home"
      >
        <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand/10">
          <Image
            src="/images/lumi-logo.png"
            alt=""
            width={32}
            height={32}
            className="size-8 object-cover"
          />
        </span>
        <span className="font-semibold tracking-tight text-foreground">Lumi</span>
      </Link>
      {children}
    </main>
  )
}
