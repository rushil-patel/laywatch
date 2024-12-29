import type { Metric } from '@prisma/client'
import { db } from '~/utils/db.server'



export async function createMetric(metric: Omit<Metric, 'createdAt' | 'updatedAt' | 'id' >) {
  return await db.metric.create({
    data: metric,
  })
}
