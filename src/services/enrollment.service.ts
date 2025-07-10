import mongoose from "mongoose";
import enrollmentRepository from "../repositories/enrollment.repository";
import { IEnrollmentDocument } from "../models/enrollment.model";
import ApiError from "../utils/apiError";
import batchRepository from "../repositories/batch.repository";

class EnrollmentService {
    /**
     * Create a new enrollment for a student in a batch.
     * Checks if already enrolled before creating.
     */
    public async create(
        data: Partial<IEnrollmentDocument>
    ): Promise<IEnrollmentDocument> {
        let { studentId, batchId } = data;
        const existingEnrollment = await enrollmentRepository.model.findOne({
            studentId: studentId,
            batchId: batchId,
            status: { $ne: "cancelled" },
        });

        if (existingEnrollment) {
            throw ApiError.badRequest("Student is already enrolled in this batch.");
        }

        const batch = await batchRepository.model.aggregate([
            { $match: { _id: batchId } },
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: { path: "$course", preserveNullAndEmptyArrays: false } },
            {
                $project: {
                    _id: 1,
                    courseId: "$course._id",
                    courseName: "$course.name",
                    courseFee: "$course.fee",
                    courseStatus: "$course.status",
                    schedule: 1,
                    maxCapacity: 1,
                    isFull: 1,
                    status: 1,
                },
            }
        ]);


        const payload: Partial<IEnrollmentDocument> = {
            studentId: data.studentId,
            batchId: data.batchId,
            fee: {

            }
        }

        const enrollment = await enrollmentRepository.create(data);
        if (!enrollment) throw ApiError.internal("Failed to create enrollment.");
        return enrollment;
    }

    /**
     * Update an existing enrollment
     */
    public async update(
        filter: Record<string, any>,
        data: Partial<IEnrollmentDocument>
    ): Promise<IEnrollmentDocument> {
        const updated = await enrollmentRepository.update(filter, data);
        if (!updated) throw ApiError.internal("Failed to update enrollment.");
        return updated;
    }

    /**
     * Get all enrollments for a student
     */
    public async getByStudent(studentId: string): Promise<IEnrollmentDocument[]> {
        return enrollmentRepository.model
            .find({
                studentId: new mongoose.Types.ObjectId(studentId),
                status: { $ne: "cancelled" },
            })
            .populate("batchId")
            .lean();
    }

    /**
     * Get all students enrolled in a batch
     */
    public async getByBatch(batchId: string): Promise<IEnrollmentDocument[]> {
        return enrollmentRepository.model
            .find({
                batchId: new mongoose.Types.ObjectId(batchId),
                status: { $ne: "cancelled" },
            })
            .populate("studentId")
            .lean();
    }
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;
