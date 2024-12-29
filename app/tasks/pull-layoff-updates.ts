import { MetricMnemonic } from "@prisma/client"
import { getOrCreateAddress } from "~/models/address/create-address"
import { getOrCreateCompany } from "~/models/company/create-company"
import MetricRepository from "~/repository/metric-repository"
import WARNLayoffMetricService from "~/services/metrics/WARNLayoffMetricService"
import { db } from "~/utils/db.server"


export const task = async () => {
    const metricService = new WARNLayoffMetricService()
    const layoffs = await metricService.getMetricData()

    const metricRepo = new MetricRepository(db)
    layoffs.forEach(async metric => {

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
        
        return {
            statusCode: 200,
            body: JSON.stringify({
            layoffs,
            }),
        }
    })
}