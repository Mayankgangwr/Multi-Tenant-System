import mongoose, { FilterQuery } from "mongoose";
import { UserRoles } from "../constants"
import ApiError from "./apiError";
import { ITenantDocument } from "../models/tenant.model";
import { IUserDocument } from "../models/user.model";
import { ICourseDocument } from "../models/course.model";


/**
 * Generates a secure filter using _id and tenantId (if not SuperAdmin).
 * Use for get, update, or delete operations on a single document.
 */
export const primaryFilter = (id: string, user: IUserDocument | undefined): Record<string, any> => {
    if (!user) throw ApiError.unauthorized("Unauthorized.");
    const filter: Record<string, any> = { _id: new mongoose.Types.ObjectId(id) };


    if (user.role !== UserRoles.SuperAdmin) {
        if (!user.tenantId) throw ApiError.unauthorized("Unauthoried.");

        filter.tenantId = new mongoose.Types.ObjectId(user.tenantId.toString()); // if stored as ObjectId
    }

    return filter;
};


export const buildTenantFilter = (
    query: Record<string, any>
): FilterQuery<ITenantDocument> => {
    const filter: FilterQuery<ITenantDocument> = {};

    filter.isDelete = false;

    if (query.isDelete) {
        filter.isDelete = query.isDelete;
    }

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

export const buildPlanFilter = (
    query: Record<string, any>
): FilterQuery<ITenantDocument> => {
    const filter: FilterQuery<ITenantDocument> = {};

    filter.isDelete = false;

    if (query.isDelete) {
        filter.isDelete = query.isDelete;
    }

    if (query.name) {
        filter.name = new RegExp(query.name, "i"); // Partial, case-insensitive match
    }

    if (query.status !== undefined) {
        if (query.status === "true") filter.status = true;
        else if (query.status === "false") filter.status = false;
    }

    return filter;
};

export const buildCourseFilter = (
    query: Record<string, any>
): FilterQuery<ICourseDocument> => {
    const filter: FilterQuery<ICourseDocument> = {};

    filter.isDelete = false;

    if (query.isDelete) {
        filter.isDelete = query.isDelete;
    }

    if (query.name) {
        filter.name = new RegExp(query.name, "i"); // Partial, case-insensitive match
    }

    if (query.status !== undefined) {
        if (query.status === "true") filter.status = true;
        else if (query.status === "false") filter.status = false;
    }

    return filter;
};