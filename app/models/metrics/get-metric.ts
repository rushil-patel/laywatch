
import { MetricMnemonic } from '@prisma/client'
import { db } from '~/utils/db.server'


export async function getLayoffMetrics(pageInfo?: {cursor?: string, limit?: number}, sort: 'asc'|'desc' = 'desc', order?: string) {
  return await db.metric.findMany({
    select: {
        id: true,
        mnemonic: true,
        effectiveOn: true,
        asOfDate: true,
        createdAt: true,
        value: true,
        company: {
            select: {
                id: true,
                name: true,
            }
        },
        location: {
            select: {
                id: true,
                raw: true,
            }
        }
    },
    ...({take: pageInfo?.limit} ?? {}),
    ...(
        pageInfo?.cursor ? {
            cursor: {
                id: pageInfo!.cursor,
            }
        } : 
        {}
    ),
    where: {
        mnemonic: MetricMnemonic.LAYOFF
    },
    orderBy: sort && order && {
        [order]: sort
    } || {
        effectiveOn: 'desc'
    }
  })
}