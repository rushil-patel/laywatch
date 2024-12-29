import type { Address } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function getOrCreateAddress(address: Pick<Address, 'raw'>) {
    return await db.address.upsert({
        where: {
            raw: address.raw
        },
        update: {
            raw: address.raw
        },
        create: {
            raw: address.raw
        }
    })
}