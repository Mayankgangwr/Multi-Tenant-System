import { ITenantDocument } from "../models/tenant.model";
import tenantRepository from "../repositories/tenant.repository";
import { PaginationOptions } from "../types/comman";
import ApiError from "../utils/apiError";
import { buildTenantFilter } from "../utils/FilterQueryBuilder";

class TenantService {
    private async existingTenant(email: string | undefined, excludeId: string | undefined = undefined) {
        if (!email) throw ApiError.badRequest("Email is required!");

        const tenant = await tenantRepository.findByEmail(email);
        if (!tenant) return false;

        // If same tenant, allow update
        if (excludeId && String(tenant._id).toString() === excludeId) return false;

        return true;
    }

    public async create(data: Partial<ITenantDocument>): Promise<ITenantDocument> {
        const isTenantExist = await this.existingTenant(data.email);
        if (isTenantExist) throw ApiError.badRequest("A tenant with this email already exists.");

        const tenant = await tenantRepository.create(data);
        if (!tenant) throw ApiError.internal("Failed to create new tenant.");

        return tenant;
    }

    public async update(tenantId: string, data: Partial<ITenantDocument>): Promise<ITenantDocument> {
        if (data.email) {
            const isTenantExist = await this.existingTenant(data.email, tenantId);
            if (isTenantExist) throw ApiError.badRequest("A tenant with this email already exists.");
        }

        const tenant = await tenantRepository.model.findByIdAndUpdate(tenantId, data);
        if (!tenant) throw ApiError.notFound(`No tenant found with ID "${tenantId}" or insufficient permissions.`);

        return tenant;
    }

    public async getById(tenantId: string): Promise<ITenantDocument> {
        const tenant = await tenantRepository.findById(tenantId);
        if (!tenant) throw ApiError.notFound(`No tenant found with ID "${tenantId}" or insufficient permissions.`);
        return tenant;
    }

    public async getOne(filter: Record<string, any>): Promise<ITenantDocument> {
        const filterQuery = buildTenantFilter(filter);
        const tenant = await tenantRepository.findOne(filterQuery);
        if (!tenant) throw ApiError.notFound("Tenant not found!.");
        return tenant;
    }

    public async getAll(
        filter: Record<string, any>,
        pagination: PaginationOptions = { skip: 0, limit: 20 }
    ): Promise<ITenantDocument[]> {
        const filterQuery = buildTenantFilter(filter);
        const tenants = await tenantRepository.findAll(filterQuery, {
            skip: pagination.skip,
            limit: pagination.limit,
            sort: { createdAt: -1 },
        });

        if (!tenants || tenants.length === 0) {
            throw ApiError.notFound("No tenants found.");
        }
        return tenants;
    }

    public async delete(id: string): Promise<boolean> {
        const isDeleted = await tenantRepository.delete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete tenant.");
        return true;
    }

    public async hardDelete(id: string): Promise<boolean> {
        const isDeleted = await tenantRepository.hardDelete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete tenant.");
        return true;
    }

}

const tenantService = new TenantService();

export default tenantService;