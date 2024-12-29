import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => [
  { title: 'Stripe Stack - Remix' },
  {
    description: `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
  {
    keywords:
      'remix, stripe, remix-stack, typescript, sqlite, postgresql, prisma, tailwindcss, fly.io',
  },
  { 'og:title': 'Stripe Stack - Remix' },
  { 'og:type': 'website' },
  { 'og:url': 'https://stripe-stack.fly.dev' },
  {
    'og:image':
      'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png',
  },
  { 'og:card': 'summary_large_image' },
  { 'og:creator': '@DanielKanem' },
  { 'og:site': 'https://stripe-stack.fly.dev' },
  {
    'og:description': `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
  {
    'twitter:image':
      'https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Stripe-Thumbnail.png',
  },
  { 'twitter:card': 'summary_large_image' },
  { 'twitter:creator': '@DanielKanem' },
  { 'twitter:title': 'Stripe Stack - Remix' },
  {
    'twitter:description': `A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io`,
  },
]

export default function Index() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      {/* Main. */}
      <div className="relative flex flex-col items-center">
        👔🖕
        {/* Headings. */}
        <div className="z-20 flex flex-col items-center">
          <h1 className="text-3xl font-light text-accent-foreground">
            <span className="font-bold ">Lay</span> Watch
          </h1>
          <p className="cursor-default text-lg font-semibold text-accent-foreground transition hover:brightness-125">
            Slow markets? Stay ahead of company layoffs
          </p>
        </div>
        <div className="my-3" />
        <div className="flex cursor-default flex-col items-center">
          <h1 className="text-center text-8xl font-bold text-gray-200">
            Search and subscribe to{' '}
            <span
              className="bg-gradient-to-b from-orange-100 to-orange-500 
							bg-clip-text text-transparent transition hover:brightness-125">
              layoff
            </span>{' '}
            updates
          </h1>
        </div>
        <div className="my-4" />
        <div className="my-3" />
        {/* Buttons. */}
        <div className="flex flex-row items-center">
          <Link
            to="/login"
            prefetch="intent"
            className="flex h-12 flex-row items-center rounded-xl bg-orange-500 px-6 font-bold 
						text-gray-100 transition hover:scale-105 hover:brightness-125 active:opacity-80">
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}
