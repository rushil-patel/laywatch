import { useFetcher } from '@remix-run/react'

export function CustomerPortalButton() {
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  return (
    <fetcher.Form method="post" action="/resources/stripe/create-customer-portal">
      <button
        className="hover:border-accent-primary flex h-10 w-48 flex-row items-center justify-center rounded-xl border border-accent-foreground px-4
        font-bold text-accent-foreground transition hover:scale-105 active:opacity-80">
        <span>{isLoading ? 'Redirecting ...' : 'Customer Portal'}</span>
      </button>
    </fetcher.Form>
  )
}
