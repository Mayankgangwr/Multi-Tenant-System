import { ISubscriptionDocument } from "../models/subscription.model";
import subscriptionRepository from "../repositories/subscription.repository";
import { PaginationOptions } from "../types/comman";
import ApiError from "../utils/apiError";
import { buildSubscriptionFilter } from "../utils/FilterQueryBuilder"; // You may need to implement this

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
        filter: Record<string, any>,
        pagination: PaginationOptions = { skip: 0, limit: 20 }
    ): Promise<ISubscriptionDocument[]> {
        const filterQuery = buildSubscriptionFilter(filter);
        const subscriptions = await subscriptionRepository.findAll(filterQuery, {
            skip: pagination.skip,
            limit: pagination.limit,
            sort: { createdAt: -1 },
        });

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
