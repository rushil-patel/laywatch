import type { Company } from '@prisma/client'
import { db } from '~/utils/db.server'


export async function getOrCreateCompany(company: Omit<Company, 'createdAt' | 'updatedAt' | 'id' >) {
    const result=  await db.company.upsert({
        where: {
            name: company.name
        },
        update: {
            name: company.name
        },
        create: {
            name: company.name
        }
    })
    return result
}
