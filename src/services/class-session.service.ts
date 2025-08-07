import mongoose, { PipelineStage, Types } from "mongoose";
import { IClassSessionDocument } from "../models/class-session.model";
import classSessionRepository from "../repositories/class-session.repository";
import { IClassSessionDto } from "../types/class-session.type";
import ApiError from "../utils/apiError";
import { generatePaginationOptions } from "../utils/pagination.util";
import { buildClassSessionFilter } from "../utils/base-filter.util";

class ClassSessionService {
    private async hasTimeConflict(
        batchId: Types.ObjectId,
        newStartTime: Date,
        newEndTime: Date,
        ignoreSessionId?: Types.ObjectId
    ): Promise<boolean> {
        const query: any = {
            batchId,
            isDeleted: false,
            startTime: { $lt: newEndTime },
            endTime: { $gt: newStartTime },
        };

        if (ignoreSessionId) {
            query._id = { $ne: ignoreSessionId };
        }

        const conflictingSession = await classSessionRepository.findOne(query);
        return !!conflictingSession;
    }

    public async create(data: IClassSessionDto): Promise<IClassSessionDocument> {
        const isConflict = await this.hasTimeConflict(data.batchId, data.startTime, data.endTime);

        if (isConflict) throw ApiError.conflict("Another class is already scheduled during this time.");

        const classSession = await classSessionRepository.create(data);
        if (!classSession) throw ApiError.internal("Failed to create new class session.");
        return classSession;
    }

    public async update(classId: string, data: Partial<IClassSessionDocument>): Promise<IClassSessionDocument> {
        const classSession = await classSessionRepository.findById(classId);
        if (!classSession) throw ApiError.notFound("Class did not find with this Id.");

        const id = new mongoose.Types.ObjectId(classId);
        const isConflict = await this.hasTimeConflict(classSession.batchId, classSession.startTime, classSession.endTime, id);

        if (isConflict) throw ApiError.conflict("Another class is already scheduled during this time.");

        const updatedClassSession = await classSessionRepository.model.findByIdAndUpdate(classId, data, { new: true });
        if (!updatedClassSession) throw ApiError.internal("Failed to update the class session.");
        return updatedClassSession;
    }

    public async getbyId(classId: string) {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(classId),
                    isDeleted: false,
                },
            },
            {
                $lookup: {
                    from: 'batches',
                    let: { batchId: '$batchId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$batchId'] },
                            },
                        },
                        {
                            $lookup: {
                                from: 'courses',
                                let: { courseId: '$courseId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$courseId'] },
                                        },
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            name: 1,
                                        },
                                    },
                                ],
                                as: 'course',
                            },
                        },
                        {
                            $unwind: {
                                path: '$course',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                schedule: 1,
                                courseId: '$course._id',
                                courseName: '$course.name',
                            },
                        },
                    ],
                    as: 'batch',
                },
            },
            {
                $unwind: {
                    path: '$batch',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { teacherId: '$teacherId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$teacherId'] },
                            },
                        },
                        {
                            $lookup: {
                                from: 'teachermetadatas',
                                localField: '_id',
                                foreignField: 'userId',
                                as: 'profile',
                            },
                        },
                        {
                            $unwind: {
                                path: '$profile',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                qualification: '$profile.qualification',
                                specialization: '$profile.specialization',
                                experience: '$profile.experience',
                                certifications: '$profile.certifications',
                                joinedAt: '$profile.joinedAt',
                            },
                        },
                    ],
                    as: 'teacher',
                },
            },
            {
                $unwind: {
                    path: '$teacher',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    title: 1,
                    startTime: 1,
                    endTime: 1,
                    isLive: 1,
                    meetLink: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    teacher: 1,
                    batch: 1,
                },
            },
        ];

        const classSession = await classSessionRepository.model.aggregate(pipeline).exec();

        if (!classSession?.length)
            throw ApiError.notFound(`No class session found with ID "${classId}".`);

        return classSession[0];
    }

    public async getAll(filter: Record<string, any>) {
        const filterQuery = buildClassSessionFilter(filter);
        const paginationOptions = generatePaginationOptions(filter);
        const { skip, limit, sort } = paginationOptions;

        const isValidStudentId = filter.studentId && mongoose.Types.ObjectId.isValid(filter.studentId);

        if (filter.studentId && !isValidStudentId) throw ApiError.badRequest("Student id is required.");

        const pipeline: PipelineStage[] = [
            {
                $match: filterQuery,
            },
            {
                $lookup: {
                    from: 'batches',
                    let: { batchId: '$batchId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$batchId'] },
                                ...(isValidStudentId && {
                                    studentIds: {
                                        $in: [new mongoose.Types.ObjectId(filter.studentId as string)],
                                    },
                                }),
                            },
                        },
                        {
                            $lookup: {
                                from: 'courses',
                                let: { courseId: '$courseId' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ['$_id', '$$courseId'] },
                                        },
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            name: 1,
                                        },
                                    },
                                ],
                                as: 'course',
                            },
                        },
                        {
                            $unwind: {
                                path: '$course',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                courseId: '$course._id',
                                courseName: '$course.name',
                            },
                        },
                    ],
                    as: 'batch',
                },
            },
            {
                $unwind: {
                    path: '$batch',
                    preserveNullAndEmptyArrays: false, // Exclude sessions with no matching batch
                },
            },
            {
                $lookup: {
                    from: 'users',
                    let: { teacherId: '$teacherId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$_id', '$$teacherId'] },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            },
                        },
                    ],
                    as: 'teacher',
                },
            },
            {
                $unwind: {
                    path: '$teacher',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    title: 1,
                    startTime: 1,
                    endTime: 1,
                    isLive: 1,
                    meetLink: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    teacher: 1,
                    batch: 1,
                },
            },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit },
        ];

        const classSession = await classSessionRepository.model.aggregate(pipeline).exec();

        if (!classSession || classSession.length === 0) {
            throw ApiError.notFound('No class session found.');
        }

        return classSession;
    }

    public async delete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await classSessionRepository.delete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to delete class session.");
        return true;
    }

    public async hardDelete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await classSessionRepository.hardDelete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to hard delete class session.");
        return true;
    }
}

const classSessionService = new ClassSessionService();
export default classSessionService;