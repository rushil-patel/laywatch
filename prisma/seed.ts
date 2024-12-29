import { MetricMnemonic, PrismaClient } from '@prisma/client'
import { db } from '~/utils/db.server'

import { getAllPlans } from '~/models/plan/get-plan'
import { PRICING_PLANS } from '~/services/stripe/plans'
import { createStripeProduct, getStripeProducts } from '~/services/stripe/api/create-product'
import { createStripePrice } from '~/services/stripe/api/create-price'
import { configureStripeCustomerPortal } from '~/services/stripe/api/configure-customer-portal'
import WARNLayoffMetricService from '~/services/metrics/WARNLayoffMetricService'
import { getOrCreateCompany } from '~/models/company/create-company'
import { getOrCreateAddress } from '~/models/address/create-address'
import MetricRepository from '~/repository/metric-repository'

const prisma = new PrismaClient()

async function seed() {

  const layoff_metrics = await new WARNLayoffMetricService().getMetricData()
  const metricRepo = new MetricRepository(db)
  layoff_metrics.forEach(async metric => {

    if (!metric.companyName) {
      console.log('error', metric)
      return
    }
    const company = await getOrCreateCompany({name: metric.companyName})
    const location = await getOrCreateAddress({raw: metric.layoffLocation})
    const metricObject = metricRepo.createMetric({
      mnemonic: MetricMnemonic.LAYOFF,
      effectiveOn: new Date(metric.effectiveDate),
      asOfDate: new Date(metric.processDate),
      value: metric.employeesAffected,
      companyId: company.id,
      locationId: location.id
    
    })
    console.log('created')
    console.log(metricObject)

  }
)

  const plans = await getAllPlans()
  console.log("Found Plans", plans)
  if (plans.length > 0) {
    console.log('🎉 Plans has already been seeded.')
    return true
  }
  const createdProducts =  await getStripeProducts()
  if (createdProducts.data.length > 0) {
    console.log(`🎉 Products have already been created. ${createdProducts.data.map(console.log)}`)
  }


  const seedProducts = Object.values(PRICING_PLANS).map(
    async ({ id, name, description, features, limits, prices }) => {
      // Format prices to match Stripe's API.
      const pricesByInterval = Object.entries(prices).flatMap(([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }))
      })


      if (createdProducts.data.length == 0) {
        // Create Stripe product.
        await createStripeProduct({
          id,
          name,
          description: description || undefined,
        })
      }

      // Create Stripe price for the current product.
      const stripePrices = await Promise.all(
        pricesByInterval.map((price) => {
          return createStripePrice(id, price)
        }),
      )

      // Store product into database.
      await db.plan.create({
        data: {
          id,
          name,
          description,
          limits: {
            create: {
              maxItems: limits.maxItems,
            },
          },
          prices: {
            create: stripePrices.map((price) => ({
              id: price.id,
              amount: price.unit_amount ?? 0,
              currency: price.currency,
              interval: price.recurring?.interval ?? 'month',
            })),
          },
        },
      })

      // Return product ID and prices.
      // Used to configure the Customer Portal.
      return {
        product: id,
        prices: stripePrices.map((price) => price.id),
      }
    },
  )

  // Create Stripe products and stores them into database.
  const seededProducts = await Promise.all(seedProducts)
  console.log(`📦 Stripe Products has been successfully created.`)

  // Configure Customer Portal.
  await configureStripeCustomerPortal(seededProducts)
  console.log(`👒 Stripe Customer Portal has been successfully configured.`)
  console.log(
    '🎉 Visit: https://dashboard.stripe.com/test/products to see your products.',
  )
}

seed()
  .catch((err: unknown) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
