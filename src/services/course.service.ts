import mongoose, { PipelineStage, Types } from "mongoose";
import { ICourseDocument } from "../models/course.model";
import courseRepository from "../repositories/course.repository";
import ApiError from "../utils/apiError";
import { buildCourseFilter } from "../utils/base-filter.util";
import { generatePaginationOptions } from "../utils/pagination.util";
import { IResponseList } from "../types/response.type";

class CourseService {
    private async getCourseById(courseId: string): Promise<ICourseDocument> {
        const tenantLookup = {
            $lookup: {
                from: 'tenants',
                let: { tenantId: '$tenantId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$tenantId'] } } },
                    { $project: { _id: 1, name: 1, email: 1, contactPhone: 1, status: 1 } }
                ],
                as: 'organization',
            },
        };

        const pipeline: PipelineStage[] = [
            { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
            tenantLookup,
            {
                $addFields: {
                    organization: { $arrayElemAt: ['$organization', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    tenantId: 1,
                    description: 1,
                    category: 1,
                    level: 1,
                    duration: 1,
                    banner: 1,
                    fee: 1,
                    isDelete: 1,
                    status: 1,
                    organization: 1,
                }
            }
        ];

        const course = await courseRepository.model.aggregate(pipeline).exec();

        if (!course?.length) {
            throw ApiError.notFound(`No course found with ID "${courseId}".`);
        }

        return course[0];
    }

    public async create(data: Partial<ICourseDocument>): Promise<ICourseDocument> {
        const existingCourse = await courseRepository.model.findOne({
            name: data.name,
            tenantId: data.tenantId,
            deletedAt: { $exists: false },
        });

        if (existingCourse) {
            throw ApiError.badRequest("Course with the same name already exists for this tenant.");
        }

        const course = await courseRepository.create(data);
        if (!course) throw ApiError.internal("Failed to create new course.");
        const courseId = String(course._id);
        const response = await this.getCourseById(courseId)
        return response;
    }

    public async update(courseId: string, data: Partial<ICourseDocument>): Promise<ICourseDocument> {
        const existingCourse = await courseRepository.model.findOne({
            _id: { $ne: courseId },
            name: data.name,
            tenantId: data.tenantId,
            deletedAt: { $exists: false },
        });

        if (existingCourse) {
            throw ApiError.badRequest("Another course with the same name already exists for this tenant.");
        }

        await courseRepository.model.findByIdAndUpdate(courseId, data, { new: true });
        const response = await this.getCourseById(courseId);
        return response;
    }

    public async getById(courseId: string): Promise<ICourseDocument> {
        const batchesLookup = {
            $lookup: {
                from: 'batches',
                let: { branchId: '$_id', courseId: '$$courseId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$branchId', '$$branchId'] },
                                    { $eq: ['$courseId', '$$courseId'] }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            let: { teacherId: '$teacherId' },
                            pipeline: [
                                { $match: { $expr: { $eq: ['$_id', '$$teacherId'] } } },
                                {
                                    $lookup: {
                                        from: 'teachermetadatas',
                                        localField: '_id',
                                        foreignField: 'userId',
                                        as: 'profile'
                                    }
                                },
                                { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        qualification: '$profile.qualification',
                                        specialization: '$profile.specialization',
                                        experience: '$profile.experience',
                                        certifications: '$profile.certifications',
                                        joinedAt: '$profile.joinedAt'
                                    }
                                }
                            ],
                            as: 'teacher'
                        }
                    },
                    { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            _id: 1,
                            schedule: 1,
                            maxCapacity: 1,
                            isFull: 1,
                            remainingSheets: 1,
                            teacher: 1,
                        }
                    }
                ],
                as: 'batches',
            }
        };

        const branchesLookup = {
            $lookup: {
                from: 'branches',
                let: { tenantId: '$organization._id', courseId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$tenantId', '$$tenantId'] }
                        }
                    },
                    batchesLookup,
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
                            weeklyOff: 1,
                            batches: 1,
                        }
                    }
                ],
                as: 'branches',
            }
        };
        return await this.getCourseById(courseId);
    }


    public async getAll(filter: Record<string, any>): Promise<IResponseList<ICourseDocument[]>> {
        const filterQuery = buildCourseFilter(filter);
        const paginationOptions = generatePaginationOptions(filter);
        const { skip, limit, sort } = paginationOptions;

        const tenantLookup = {
            $lookup: {
                from: 'tenants',
                let: { tenantId: '$tenantId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$tenantId']
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                            contactPhone: 1,
                            status: 1
                        }
                    }
                ],
                as: 'organization'
            }
        };

        const branchesLookup = {
            $lookup: {
                from: 'branches',
                let: {
                    tenantId: '$organization._id',
                    courseId: '$_id' // 👈 define courseId here so it is available
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$tenantId', '$$tenantId']
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: 'batches',
                            let: {
                                branchId: '$_id',
                                courseId: '$$courseId'
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ['$branchId', '$$branchId'] },
                                                { $eq: ['$courseId', '$$courseId'] }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        let: { teacherIds: '$teacherIds' },
                                        pipeline: [
                                            {
                                                $match: {
                                                    $expr: {
                                                        $in: ['$_id', '$$teacherIds']
                                                    }
                                                }
                                            },
                                            {
                                                $lookup: {
                                                    from: 'teachermetadatas',
                                                    localField: '_id',
                                                    foreignField: 'userId',
                                                    as: 'profile'
                                                }
                                            },
                                            { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
                                            {
                                                $project: {
                                                    _id: 1,
                                                    name: 1,
                                                    qualification: '$profile.qualification',
                                                    specialization: '$profile.specialization',
                                                    experience: '$profile.experience',
                                                    certifications: '$profile.certifications',
                                                    joinedAt: '$profile.joinedAt'
                                                }
                                            }
                                        ],
                                        as: 'teachers'
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        schedule: 1,
                                        maxCapacity: 1,
                                        isFull: 1,
                                        remainingSheets: 1,
                                        teachers: 1,
                                    }
                                }
                            ],
                            as: 'batches'
                        }
                    },
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
                            weeklyOff: 1,
                            batches: 1
                        }
                    }
                ],
                as: 'branches'
            }
        };

        const pipeline: PipelineStage[] = [
            { $match: filterQuery },
            tenantLookup,
            {
                $addFields: {
                    organization: { $arrayElemAt: ['$organization', 0] }
                }
            },
            // branchesLookup,
            {
                $project: {
                    _id: 1,
                    name: 1,
                    tenantId: 1,
                    description: 1,
                    category: 1,
                    level: 1,
                    duration: 1,
                    banner: 1,
                    fee: 1,
                    isDelete: 1,
                    status: 1,
                    organization: 1,
                    // branches: 1
                }
            },
            {
                $facet: {
                    metadata: [
                        { $count: "total" } // count all records after filter
                    ],
                    records: [
                        { $sort: sort },
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            },
            {
                $project: {
                    total: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
                    records: 1
                }
            }
        ];

        const courses = await courseRepository.model.aggregate(pipeline).exec();

        if (!courses || courses.length === 0 || courses[0].total === 0) {
            throw ApiError.notFound('No courses found.');
        }

        return {
            total: courses[0].total,
            records: courses[0].records
        };
    }

    public async delete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await courseRepository.delete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to delete course.");
        return true;
    }

    public async hardDelete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await courseRepository.hardDelete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to hard delete course.");
        return true;
    }
}

const courseService = new CourseService();
export default courseService;
