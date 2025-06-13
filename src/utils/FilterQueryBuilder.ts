import mongoose, { FilterQuery } from "mongoose";
import { ITenantDocument } from "../models/tenant.model";
import { ISubscriptionDocument } from "../models/subscription.model";

export const buildTenantFilter = (
    query: Record<string, any>
): FilterQuery<ITenantDocument> => {
    const filter: FilterQuery<ITenantDocument> = {};

    if (query.name) {
        filter.name = new RegExp(query.name, "i"); // Partial, case-insensitive match
    }

    if (query.email) {
        filter.email = query.email; // Exact match
    }

    if (query.status !== undefined) {
        if (query.status === "true") filter.status = true;
        else if (query.status === "false") filter.status = false;
    }

    if (query.subscriptionId && mongoose.Types.ObjectId.isValid(query.subscriptionId)) {
        filter.subscriptionId = new mongoose.Types.ObjectId(String(query.subscriptionId));
    }

    return filter;
};



export const buildSubscriptionFilter = (
    query: Record<string, any>
): FilterQuery<ISubscriptionDocument> => {
    const filter: FilterQuery<ISubscriptionDocument> = {};

    if (query.planId && mongoose.Types.ObjectId.isValid(query.planId)) {
        filter.planId = new mongoose.Types.ObjectId(String(query.planId));
    }

    if (query.tenantId && mongoose.Types.ObjectId.isValid(query.tenantId)) {
        filter.tenantId = new mongoose.Types.ObjectId(String(query.tenantId));
    }

    if (query.isExpired !== undefined) {
        if (query.isExpired === "true") filter.isExpired = true;
        else if (query.isExpired === "false") filter.isExpired = false;
    }

    if (query.paymentStatus) {
        const validStatuses = ["Pending", "Paid", "Failed"];
        if (validStatuses.includes(query.paymentStatus)) {
            filter.paymentStatus = query.paymentStatus as "Pending" | "Paid" | "Failed";
        }
    }

    if (query.startDateFrom || query.startDateTo) {
        filter.startedAt = {};
        if (query.startDateFrom) {
            filter.startedAt.$gte = new Date(query.startDateFrom);
        }
        if (query.startDateTo) {
            filter.startedAt.$lte = new Date(query.startDateTo);
        }
    }

    if (query.endDateFrom || query.endDateTo) {
        filter.endDate = {};
        if (query.endDateFrom) {
            filter.endDate.$gte = new Date(query.endDateFrom);
        }
        if (query.endDateTo) {
            filter.endDate.$lte = new Date(query.endDateTo);
        }
    }

    return filter;
};
