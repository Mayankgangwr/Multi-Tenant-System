import { PipelineStage } from "mongoose";
import { ITenantDocument } from "../models/tenant.model";
import tenantRepository from "../repositories/tenant.repository";
import ApiError from "../utils/apiError";
import { buildTenantFilter } from "../utils/FilterQueryBuilder";
import { generatePaginationDto, generatePaginationOptions } from "../utils/pagination.util";

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
    ): Promise<ITenantDocument[]> {
        const filterQuery = buildTenantFilter(filter);
        const pagination = generatePaginationDto(filter);

        const tenants = await tenantRepository.findAll(filterQuery, pagination);

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

    public async topTenant(filter: Record<string, any>) {
        const pipeline: PipelineStage[] = [];
        if (filter.search?.trim()) pipeline.push({ $match: { name: { $regex: filter.search, $options: 'i' } } });

        const paginationOptions = generatePaginationOptions(filter);
        const { skip, limit, sort } = paginationOptions;

        const tenants = await tenantRepository.model.aggregate([
            ...pipeline,
            {
                $lookup: {
                    from: "courses",
                    let: { tenantId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$tenantId", "$$tenantId"] } } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                description: 1,
                                status: 1,
                                category: 1,
                                level: 1,
                                duration: 1,
                                imageUrl: 1,
                                fee: 1
                            }
                        }
                    ],
                    as: "courses"
                }
            },
            {
                $lookup: {
                    from: "branches",
                    let: { tenantId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$tenantId", "$$tenantId"] } } },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                location: 1,
                                contactEmail: 1,
                                phoneNumber: 1,
                                timeZone: 1,
                                isMainBranch: 1,
                                holidays: 1,
                                weeklyOff: 1
                            }
                        }
                    ],
                    as: "branches"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    courses: 1,
                    branches: 1
                }
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ]).exec();

        if (!tenants || tenants.length === 0) throw ApiError.notFound("No tenants found.");

        return tenants;
    }
}

const tenantService = new TenantService();

export default tenantService;