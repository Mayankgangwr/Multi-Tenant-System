import { Types } from "mongoose";
import { IBatchDocument } from "../models/batch.model";
import batchRepository from "../repositories/batch.repository";
import ApiError from "../utils/apiError";
import { buildBatchFilter } from "../utils/base-filter.util";
import { generatePaginationDto, generatePaginationOptions } from "../utils/pagination.util";

class BatchService {
    public async create(data: Partial<IBatchDocument>): Promise<IBatchDocument> {
        const existingBatch = await batchRepository.model.findOne({
            tenantId: data.tenantId,
            courseId: data.courseId,
            branchId: data.branchId,
            teacherId: data.teacherId,
            schedule: data.schedule,
            deletedAt: { $exists: false },
        });

        if (existingBatch) {
            throw ApiError.badRequest(
                "Batch with the same schedule and details already exists for this tenant."
            );
        }

        const batch = await batchRepository.create(data);
        if (!batch) throw ApiError.internal("Failed to create new batch.");
        return batch;
    }

    public async update(batchId: string, data: Partial<IBatchDocument>): Promise<IBatchDocument> {
        const existingBatch = await batchRepository.model.findOne({
            _id: { $ne: batchId },
            tenantId: data.tenantId,
            courseId: data.courseId,
            branchId: data.branchId,
            teacherId: data.teacherId,
            schedule: data.schedule,
            deletedAt: { $exists: false },
        });

        if (existingBatch) {
            throw ApiError.badRequest(
                "Another batch with the same schedule and details already exists for this tenant."
            );
        }

        const batch = await batchRepository.model.findByIdAndUpdate(batchId, data, { new: true });
        if (!batch) throw ApiError.notFound(`No batch found with ID "${batchId}".`);
        return batch;
    }

    public async getById(batchId: string): Promise<IBatchDocument> {
        const batch = await batchRepository.findById(batchId);
        if (!batch) throw ApiError.notFound(`No batch found with ID "${batchId}".`);
        return batch;
    }

    public async getAll(query: Record<string, any>): Promise<IBatchDocument[]> {
        const filterQuery = buildBatchFilter(query);
        const paginationOptions = generatePaginationOptions(query);
        const { skip, limit, sort } = paginationOptions;
        const batches = await batchRepository.model.aggregate([
            { $match: filterQuery },
            {
                $lookup: {
                    from: "tenants",
                    foreignField: "_id",
                    localField: "tenantId",
                    as: "organization"
                }
            },
            { $unwind: { path: "$organization", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "courses",
                    foreignField: "_id",
                    localField: "courseId",
                    as: "course"
                }
            },
            { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "branches",
                    foreignField: "_id",
                    localField: "branchId",
                    as: "branch"
                }
            },
            { $unwind: { path: "$branch", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "teacherId",
                    as: "teacher"
                }
            },
            { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "teachermetadatas",
                    foreignField: "userId",
                    localField: "teacherId",
                    as: "metadata"
                }
            },
            { $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    organization: {
                        _id: "$organization._id",
                        name: "$organization.name",
                        email: "$organization.email",
                        status: "$organization.status"
                    },
                    course: {
                        _id: "$course._id",
                        name: "$course.name",
                        description: "$course.description",
                        category: "$course.category",
                        level: "$course.level",
                        duration: "$course.duration",
                        imageUrl: "$course.imageUrl",
                        fee: "$course.fee",
                        status: "$course.status",
                        isDelete: "$course.isDelete"
                    },
                    branch: {
                        _id: "$course._id",
                        name: "$course.name",
                        location: "$course.location",
                        contactEmail: "$course.contactEmail",
                        phoneNumber: "$course.phoneNumber",
                        timeZone: "$course.timeZone",
                        isMainBranch: "$course.isMainBranch",
                        holidays: "$course.holidays",
                        weeklyOff: "$course.weeklyOff",
                        isDelete: "$course.isDelete"
                    },
                    teacher: {
                        _id: "$teacher._id",
                        name: "$teacher.name",
                        email: "$teacher.email",
                        qualification: "$metadata.qualification",
                        specialization: "$metadata.specialization",
                        experience: "$metadata.experience",
                        certifications: "$metadata.certifications",
                        joinedAt: "$metadata.joinedAt",
                    },
                    schedule: 1,
                    maxCapacity: 1,
                    isFull: 1,
                    status: 1,
                    isDelete: 1,
                }
            },

            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ]);

        if (!batches || batches.length === 0) {
            throw ApiError.notFound("No batches found.");
        }

        return batches;
    }

    public async delete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await batchRepository.delete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to delete batch.");
        return true;
    }

    public async hardDelete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await batchRepository.hardDelete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to hard delete batch.");
        return true;
    }
}

const batchService = new BatchService();
export default batchService;
