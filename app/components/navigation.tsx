import type { User } from '@prisma/client'
import { Link, Form, useLocation } from '@remix-run/react'

type NavigationProps = {
  user: User | null
}

export function Navigation({ user }: NavigationProps) {
  const location = useLocation()

  return (
    <header
      className="z-10 m-auto my-0 flex max-h-[80px] min-h-[80px] 
			w-full flex-row items-center justify-between">
      {/* Left Menu. */}
      <Link
        to={!user ? '/' : '/home'}
        prefetch="intent"
        className="flex flex-row items-center text-xl font-light text-accent-foreground transition hover:text-orange-500 active:opacity-80">
        <span className="font-bold text-accent-foreground">Lay</span>&nbsp;Watch
        <div className="mx-1" />
        <small className="text: relative top-[2px] text-sm font-extrabold text-gray-200 dark:text-orange-200">
          v1.0
        </small>
      </Link>

      {/* Right Menu. */}
      <div className="flex flex-row items-center">
        {user && (
          <Link
            to="/account"
            prefetch="intent"
            className="active:border-accent-primary flex flex-row items-center text-sm font-semibold
					text-accent-foreground transition hover:border-b-2 hover:border-accent">
            Account
          </Link>
        )}

        <div className="mx-3 hidden sm:block" />

        {!user &&
          location &&
          (location.pathname === '/' || location.pathname === '/plans') && (
            <>
              <div className="mx-3" />
              <Link
                to="/login"
                className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-accent-foreground
					      transition hover:scale-105 hover:border-accent-foreground  hover:text-accent-foreground active:opacity-80">
                Log In
              </Link>
            </>
          )}

        {/* Log Out Form Button. */}
        {user && (
          <>
            <div className="mx-3" />
            <Form action="/auth/logout" method="post">
              <button
                className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-4 font-bold text-accent-foreground 
					      transition hover:scale-105 hover:border-gray-200 hover:text-gray-100 active:opacity-80">
                Log Out
              </button>
            </Form>
          </>
        )}
      </div>
    </header>
  )
}
