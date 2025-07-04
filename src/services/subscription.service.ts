import { ISubscriptionDocument } from "../models/subscription.model";
import subscriptionRepository from "../repositories/subscription.repository";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";
import ApiError from "../utils/apiError";
import { buildSubscriptionFilter } from "../utils/FilterQueryBuilder"; // You may need to implement this
import generatePagination, { generatePaginationDto } from "../utils/pagination.util";

class SubscriptionService {
    public async create(data: Partial<ISubscriptionDocument>): Promise<ISubscriptionDocument> {
        const subscription = await subscriptionRepository.create(data);
        if (!subscription) throw ApiError.internal("Failed to create new subscription.");
        return subscription;
    }

    public async update(subscriptionId: string, data: Partial<ISubscriptionDocument>): Promise<ISubscriptionDocument> {
        const subscription = await subscriptionRepository.update(subscriptionId, data);
        if (!subscription) throw ApiError.notFound(`No subscription found with ID "${subscriptionId}".`);
        return subscription;
    }

    public async getById(subscriptionId: string): Promise<ISubscriptionDocument> {
        const subscription = await subscriptionRepository.findById(subscriptionId);
        if (!subscription) throw ApiError.notFound(`No subscription found with ID "${subscriptionId}".`);
        return subscription;
    }

    public async getAll(
        query: Record<string, any>,
    ): Promise<ISubscriptionDocument[]> {
        const filterQuery = buildSubscriptionFilter(query);
        const pagination = generatePaginationDto(query);
        const paginationOptions: IPaginationOptions<ISubscriptionDocument> = generatePagination(pagination);
        const { skip, limit, sort, projection } = paginationOptions;
        const subscriptions = await subscriptionRepository.model.aggregate([
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: "plans",
                    foreignField: "_id",
                    localField: "planId",
                    as: "plan"
                }
            },
            {
                $lookup: {
                    from: "tenants",
                    foreignField: "_id",
                    localField: "tenantId",
                    as: "organization"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    plan: { $first: { $arrayElemAt: ["$plan", 0] } },
                    organization: { $first: { $arrayElemAt: ["$organization", 0] } },
                    startedAt: { $first: "$startedAt" },
                    endDate: { $first: "$endDate" },
                    isExpired: { $first: "$isExpired" },
                    paymentStatus: { $first: "$paymentStatus" }
                }
            },

            {
                $project: {
                    _id: 1,
                    startedAt: 1,
                    endDate: 1,
                    isExpired: 1,
                    paymentStatus: 1,

                    plan: {
                        _id: "$plan._id",
                        name: "$plan.name",
                        price: "$plan.price",
                        features: "$plan.features",
                        duration: "$plan.duration",
                        maxUsers: "$plan.maxUsers",
                        trialPeriodDays: "$plan.trialPeriodDays"
                    },
                    organization: {
                        _id: "$organization._id",
                        name: "$organization.name",
                        email: "$organization.email",
                        status: "$organization.status"
                    }
                }
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ]);


        // const subscriptions = await subscriptionRepository.findAll(filterQuery, pagination);

        if (!subscriptions || subscriptions.length === 0) {
            throw ApiError.notFound("No subscriptions found.");
        }
        return subscriptions;
    }

    public async delete(id: string): Promise<boolean> {
        const isDeleted = await subscriptionRepository.delete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete subscription.");
        return true;
    }

    public async hardDelete(id: string): Promise<boolean> {
        const isDeleted = await subscriptionRepository.hardDelete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete subscription.");
        return true;
    }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
