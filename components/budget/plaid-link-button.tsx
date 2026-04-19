'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'

declare global {
  interface Window {
    Plaid: any
  }
}

interface PlaidLinkButtonProps {
  onSuccess: (publicToken: string) => void
  loading?: boolean
}

export function PlaidLinkButton({ onSuccess, loading = false }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Plaid script
    const script = document.createElement('script')
    script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
    script.async = true
    script.onload = () => {
      fetchLinkToken()
    }
    script.onerror = () => {
      setError('Failed to load Plaid library')
      setIsLoading(false)
    }
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const fetchLinkToken = async () => {
    try {
      const response = await fetch('/api/plaid/link-token', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setLinkToken(data.link_token)
      }
    } catch (err) {
      console.error('Failed to fetch link token:', err)
      setError('Failed to initialize Plaid')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    if (!linkToken || !window.Plaid) {
      setError('Plaid is not ready')
      return
    }

    const plaidHandler = window.Plaid.create({
      token: linkToken,
      onSuccess: (public_token: string) => {
        onSuccess(public_token)
      },
      onExit: () => {
        console.log('User exited Plaid Link')
      },
      onEvent: (eventName: string) => {
        console.log('Plaid event:', eventName)
      },
    })

    plaidHandler.open()
  }

  if (error) {
    return (
      <div className="inline-flex items-center gap-2 text-destructive">
        <AlertCircle className="size-5" />
        <span className="text-sm">{error}</span>
      </div>
    )
  }

  if (isLoading || loading) {
    return (
      <Button disabled className="gap-2">
        <Spinner className="size-4" />
        Connecting...
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={!linkToken}
      size="lg"
      className="gap-2"
    >
      Connect Your Bank Account
    </Button>
  )
}
