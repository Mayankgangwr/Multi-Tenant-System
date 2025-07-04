import mongoose, { FilterQuery } from "mongoose";
import { UserRoles } from "../constants"
import ApiError from "./apiError";
import { ITenantDocument } from "../models/tenant.model";
import { IUserDocument } from "../models/user.model";
import { ICourseDocument } from "../models/course.model";
import { IBranchDocument } from "../models/branch.model";
import { IBatchDocument } from "../models/batch.model";


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

export const buildBranchFilter = (
    query: Record<string, any>
): FilterQuery<IBranchDocument> => {
    const filter: FilterQuery<IBranchDocument> = {};

    // Soft delete flag
    filter.isDeleted = false;
    if (query.isDeleted !== undefined) {
        filter.isDeleted = query.isDeleted === "true";
    }

    // Filter by name (case-insensitive partial match)
    if (query.name) {
        filter.name = new RegExp(query.name, "i");
    }

    // Filter by location (case-insensitive partial match)
    if (query.location) {
        filter.location = new RegExp(query.location, "i");
    }

    // Filter by isMainBranch (boolean string)
    if (query.isMainBranch !== undefined) {
        if (query.isMainBranch === "true") filter.isMainBranch = true;
        else if (query.isMainBranch === "false") filter.isMainBranch = false;
    }

    // Optional: filter by tenantId
    if (query.tenantId) {
        filter.tenantId = new mongoose.Types.ObjectId(String(query.tenantId));;
    }



    return filter;
};

export const buildBatchFilter = (query: Record<string, any>): FilterQuery<IBatchDocument> => {
    const filter: FilterQuery<IBatchDocument> = {};

    filter.isDeleted = false;
    if (query.isDeleted !== undefined) {
        filter.isDeleted = query.isDeleted === "true";
    }

    if (query.tenantId) {
        filter.tenantId = new mongoose.Types.ObjectId(String(query.tenantId));;
    }

    if (query.branchId) {
        filter.branchId = new mongoose.Types.ObjectId(String(query.branchId));;
    }

    if (query.teacherId) {
        filter.teacherId = new mongoose.Types.ObjectId(String(query.teacherId));;
    }

    if (query.courseId) {
        filter.courseId = new mongoose.Types.ObjectId(String(query.courseId));;
    }

    if (query.schedule) {
        filter.schedule = query.schedule;
    }



    return filter;
}