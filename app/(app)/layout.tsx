import { redirect } from 'next/navigation'
import { AppNav } from '@/components/budget/app-nav'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware already guards these routes, but double-check on the server
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <>
      <AppNav userEmail={user.email ?? ''} />
      {children}
    </>
  )
}
