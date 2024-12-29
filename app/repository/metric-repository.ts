import type { MetricMnemonic, PrismaClient } from '@prisma/client';
import { createMetric } from '~/models/metrics/create-metric';
import { getAllLayoffs, getLayoffMetrics } from '~/models/metrics/get-metric';

type CreateMetricInput = {
    mnemonic: string;
    value: number;
    effectiveOn: Date;
    asOfDate: Date;
    companyId: string;
    locationId: string;
}

class MetricRepository {

    private db: PrismaClient;

    constructor(db?: PrismaClient ) {
        this.db = db;
    }

    async createMetric(metric: CreateMetricInput) {

        return await createMetric({
            mnemonic: metric.mnemonic as MetricMnemonic,
            value: metric.value,
            effectiveOn: metric.effectiveOn,
            asOfDate: metric.asOfDate,
            companyId: metric.companyId,
            locationId: metric.locationId,
        })
    }

    async getMetrics(pageInfo?: {cursor?: string, limit?: number}, sort?: 'asc'|'desc', order?: string) {
        return await getLayoffMetrics(pageInfo, sort, order)
    }
}

export default MetricRepository;