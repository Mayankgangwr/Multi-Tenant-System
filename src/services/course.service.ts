import mongoose, { Types } from "mongoose";
import { ICourseDocument } from "../models/course.model";
import courseRepository from "../repositories/course.repository";
import ApiError from "../utils/apiError";
import { buildCourseFilter } from "../utils/base-filter.util";
import { generatePaginationOptions } from "../utils/pagination.util";

class CourseService {
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
        return course;
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

        const course = await courseRepository.model.findByIdAndUpdate(courseId, data, { new: true });
        if (!course) throw ApiError.notFound(`No course found with ID "${courseId}".`);
        return course;
    }

    public async getById(courseId: string): Promise<ICourseDocument> {
        const course = await courseRepository.model.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(courseId)
                }
            },
            {
                $lookup: {
                    from: 'tenants',
                    foreignField: '_id',
                    localField: 'tenantId',
                    as: 'organization'
                }
            },
            {
                $unwind: {
                    path: '$organization',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'branches',
                    let: { tenantId: '$organization._id', courseId: '$_id' },
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
                                        $project: {
                                            _id: 1,
                                            schedule: 1,
                                            maxCapacity: 1,
                                            isFull: 1,
                                            remainingSheets: 1
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
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    category: 1,
                    level: 1,
                    duration: 1,
                    imageUrl: 1,
                    fee: 1,
                    isDelete: 1,
                    status: 1,
                    organization: {
                        _id: '$organization._id',
                        name: '$organization.name',
                        email: '$organization.email',
                        contactPhone: '$organization.contactPhone',
                        status: '$organization.status'
                    },
                    branches: 1
                }
            }
        ]).exec();

        if (!course?.length) {
            throw ApiError.notFound(`No course found with ID "${courseId}".`);
        }

        return course[0];
    }



    public async getAll(filter: Record<string, any>): Promise<ICourseDocument[]> {
        const filterQuery = buildCourseFilter(filter);
        const paginationOptions = generatePaginationOptions(filter);
        const { skip, limit, sort } = paginationOptions;
        const courses = await courseRepository.model.aggregate([
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
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    category: 1,
                    level: 1,
                    duration: 1,
                    imageUrl: 1,
                    fee: 1,
                    isDelete: 1,
                    status: 1,
                    organization: {
                        _id: "$organization._id",
                        name: "$organization.name",
                        email: "$organization.email",
                        contactPhone: "$organization.contactPhone",
                        status: "$organization.status"
                    }
                }
            },

            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ]);
        if (!courses || courses.length === 0) {
            throw ApiError.notFound("No courses found.");
        }
        return courses;
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
