import { IPlanDocument } from "../models/plan.model";
import planRepository from "../repositories/plan.repository";
import ApiError from "../utils/apiError";
import { buildPlanFilter } from "../utils/base-filter.util";

class TenantService {
    public async create(data: Partial<IPlanDocument>): Promise<IPlanDocument> {
        const plan = await planRepository.create(data);
        if (!plan) throw ApiError.internal("Failed to create new plan.");
        return plan;
    }

    public async update(planId: string, data: Partial<IPlanDocument>): Promise<IPlanDocument> {
        const plan = await planRepository.model.findByIdAndUpdate(planId, data);
        if (!plan) throw ApiError.notFound(`No plan found with ID "${planId}" or insufficient permissions.`);

        return plan;
    }

    public async getById(planId: string): Promise<IPlanDocument> {
        const plan = await planRepository.findById(planId);
        if (!plan) throw ApiError.notFound(`No plan found with ID "${planId}" or insufficient permissions.`);
        return plan;
    }

    public async getAll(filter: Record<string, any>): Promise<IPlanDocument[]> {
        const filterQuery = buildPlanFilter(filter);
        const plans = await planRepository.findAll(filterQuery);

        if (!plans || plans.length === 0) {
            throw ApiError.notFound("No plans found.");
        }
        return plans;
    }

    public async delete(id: string): Promise<boolean> {
        const isDeleted = await planRepository.delete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete plan.");
        return true;
    }

    public async hardDelete(id: string): Promise<boolean> {
        const isDeleted = await planRepository.hardDelete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete plan.");
        return true;
    }

}

const tenantService = new TenantService();

export default tenantService;