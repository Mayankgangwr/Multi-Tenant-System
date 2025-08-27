import mongoose, { PipelineStage, Types } from "mongoose";
import { IAssignmentDocument } from "../models/assignment.model";
import assignmentRepository from "../repositories/assignment.repository";
import { IAssignmentDto } from "../types/assignment.type";
import ApiError from "../utils/apiError";

class AssignmentService {
    private async hasAssignmentConflict(tenantId: Types.ObjectId, batchId: Types.ObjectId,
        subjectId: Types.ObjectId, title: string, excludeId?: Types.ObjectId): Promise<boolean> {
        const query: any = {
            tenantId, batchId, subjectId,
            title: { $regex: new RegExp(`^${title}$`, "i") }
        };

        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        const existing = await assignmentRepository.findOne(query);
        return !!existing;
    }

    public async create(data: IAssignmentDto): Promise<IAssignmentDocument> {

        const isConflict = await this.hasAssignmentConflict(data.tenantId, data.batchId, data.subjectId, data.title);

        if (isConflict) throw ApiError.conflict("Same assignment is already scheduled.");

        const assignment = await assignmentRepository.create(data);
        if (!assignment) throw ApiError.internal("Failed to create new assignment.");
        return assignment;

    }

    public async update(assignmentId: string, data: Partial<IAssignmentDto>): Promise<IAssignmentDocument> {
        const assignment = await assignmentRepository.findById(assignmentId);
        if (!assignment) throw ApiError.notFound("Assignment did not find with this Id.");

        if (!data?.tenantId || !data?.batchId || !data?.subjectId || !data.title || !data.createdBy) {
            throw ApiError.badRequest(
                "Missing required fields: tenantId, batchId, subjectId, title, and createdBy are mandatory."
            );
        }

        const isConflict = await this.hasAssignmentConflict(data.tenantId, data.batchId, data.subjectId, data.title, data.createdBy);

        if (isConflict) throw ApiError.conflict("Same assignment is already scheduled.");

        const updatedAssignment = await assignmentRepository.model.findByIdAndUpdate(assignmentId, data, { new: true });
        if (!updatedAssignment) throw ApiError.internal("Failed to update the Assignment.");
        return updatedAssignment;
    }

    public async getAssignmentById(assignmentId: string, studentId?: string): Promise<any> {
        const filterQuery: Record<string, any> = {
            _id: new mongoose.Types.ObjectId(assignmentId),
        };

        const batchPipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "batches",
                    let: { batchId: "$batchId", subjectId: "$subjectId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$batchId"] },
                            },
                        },
                        {
                            $lookup: {
                                from: "courses",
                                let: { courseId: "$courseId" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$courseId"] },
                                        },
                                    },
                                    { $project: { _id: 1, name: 1 } },
                                ],
                                as: "course",
                            },
                        },
                        { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
                        {
                            $addFields: {
                                subject: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$subjects",
                                                as: "subject",
                                                cond: { $eq: ["$$subject._id", "$$subjectId"] },
                                            },
                                        },
                                        0,
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                schedule: 1,
                                course: {
                                    id: "$course._id",
                                    name: "$course.name",
                                },
                                subject: {
                                    $cond: [
                                        { $ne: ["$subject", null] },
                                        {
                                            id: "$subject._id",
                                            description: "$subject.description",
                                            title: "$subject.title",
                                        },
                                        "$$REMOVE",
                                    ],
                                },
                            },
                        },
                    ],
                    as: "batch",
                },
            },
            { $unwind: { path: "$batch", preserveNullAndEmptyArrays: true } },
        ];

        const teacherPipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "createdBy",
                    as: "teacher",
                },
            },
            { $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
        ];

        const submittedAssignmentPipeline: PipelineStage[] =
            studentId
                ? [
                    {
                        $lookup: {
                            from: "submittedassignments",
                            let: { assignmentId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $and: [
                                                { $eq: ["$assignmentId", "$$assignmentId"] },
                                                { $eq: ["$studentId", new mongoose.Types.ObjectId(studentId)] },
                                                { $eq: ["$status", true] },
                                                { $ne: ["$isDeleted", true] },
                                            ],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        assignmentId: 1,
                                        studentId: 1,
                                        description: 1,
                                        files: 1,
                                        urls: 1,
                                        progress: 1,
                                        completionStatus: 1,
                                    }
                                }
                            ],
                            as: "submittedAssignment",
                        },
                    },
                    {
                        $unwind: {
                            path: "$submittedAssignment",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ]
                : [];

        const pipeline: PipelineStage[] = [
            { $match: filterQuery },
            ...batchPipeline,
            ...teacherPipeline,
            ...submittedAssignmentPipeline,
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    instructions: 1,
                    attachments: 1,
                    githubTemplateUrl: 1,
                    dueDate: 1,
                    batch: 1,
                    teacher: {
                        id: "$teacher._id",
                        name: "$teacher.name",
                    },
                    submittedAssignment: 1, // ✅ include in result
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ];

        const result = await assignmentRepository.model.aggregate(pipeline);
        return result[0] || null;
    }


    public async delete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await assignmentRepository.delete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to delete assignment.");
        return true;
    }

    public async hardDelete(id: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await assignmentRepository.hardDelete(id, tenantId);
        if (!isDeleted) throw ApiError.internal("Failed to hard delete assignment.");
        return true;
    }
}

const assignmentService = new AssignmentService();
export default assignmentService;
