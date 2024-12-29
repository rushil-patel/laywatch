import type { PlanLimit, Price } from '@prisma/client'

/**
 * Defines our plans IDs.
 */
export const enum PlanId {
  FREE = 'free',
  SUPPORTER = 'supporter',
}

/**
 * Defines our plan pricing intervals.
 */
export const enum Interval {
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Defines our plan pricing currencies.
 */
export const enum Currency {
  DEFAULT_CURRENCY = 'usd',
  USD = 'usd',
  EUR = 'eur',
}

/**
 * Defines our plans structure.
 */
export const PRICING_PLANS = {
  [PlanId.FREE]: {
    id: PlanId.FREE,
    name: 'Free',
    description: 'This website will stay free to use for as long as possible.',
    features: ['Unlimted spot registrations', 'Unlimited spot reservations'],
    limits: { maxItems: 9 },
    prices: {
      [Interval.MONTH]: {
        [Currency.USD]: 0,
        [Currency.EUR]: 0,
      },
      [Interval.YEAR]: {
        [Currency.USD]: 0,
        [Currency.EUR]: 0,
      },
    },
  },
  [PlanId.SUPPORTER]: {
    id: PlanId.SUPPORTER,
    name: 'Supporter',
    description: 'Support this website with a small contribution.',
    features: ['Unlimted spot registrations', 'Unlimited spot reservations'],
    limits: { maxItems: 99 },
    prices: {
      [Interval.MONTH]: {
        [Currency.USD]: 100,
        [Currency.EUR]: 100,
      },
      [Interval.YEAR]: {
        [Currency.USD]: 1200,
        [Currency.EUR]: 1200,
      },
    },
  },
} satisfies PricingPlan

/**
 * A helper type that defines our price by interval.
 */
export type PriceInterval<
  I extends Interval = Interval,
  C extends Currency = Currency,
> = {
  [interval in I]: {
    [currency in C]: Price['amount']
  }
}

/**
 * A helper type that defines our pricing plans structure by Interval.
 */
export type PricingPlan<T extends PlanId = PlanId> = {
  [key in T]: {
    id: string
    name: string
    description: string
    features: string[]
    limits: Pick<PlanLimit, 'maxItems'>
    prices: PriceInterval
  }
}
