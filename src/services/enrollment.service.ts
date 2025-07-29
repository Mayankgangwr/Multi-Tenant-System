import mongoose, { Types } from "mongoose";
import enrollmentRepository from "../repositories/enrollment.repository";
import { IEnrollmentDocument } from "../models/enrollment.model";
import ApiError from "../utils/apiError";
import batchRepository from "../repositories/batch.repository";
import courseRepository from "../repositories/course.repository";
import userRepository from "../repositories/user.repository";
import { CreateOrderRequest } from "cashfree-pg";
import moment from "moment";
import cashfreeService from "./cashfree.service";
import paymentService from "./payment.service";
import { IBatchDocument } from "../models/batch.model";
import studentMetaService from "./student-meta.service";
class EnrollmentService {

    public async enroll(data: Partial<IEnrollmentDocument>): Promise<IEnrollmentDocument> {
        const { studentId, batchId } = data
        if (!studentId || !batchId) {
            throw ApiError.badRequest("Student and batch both IDs are required.");
        }

        const existingEnrollment = await enrollmentRepository.model.findOne({
            studentId,
            batchId,
            status: { $ne: "cancelled" },
        });

        if (existingEnrollment) throw ApiError.badRequest("Student is already enrolled in this batch.");

        const enroll = await enrollmentRepository.create(data);

        if (!enroll) throw ApiError.internal(`Failed to insert the enroll`);

        return enroll



    }

    public async createPaymentIntent(batchId: mongoose.Types.ObjectId, studentId: mongoose.Types.ObjectId) {
        if (!studentId || !batchId) {
            throw ApiError.badRequest("Student and batch both IDs are required.");
        }

        const existingEnrollment = await enrollmentRepository.model.findOne({
            studentId,
            batchId,
            status: { $ne: "cancelled" },
        });

        if (existingEnrollment) throw ApiError.badRequest("Student is already enrolled in this batch.");

        const batch = await batchRepository.findById(String(batchId));
        if (!batch) throw ApiError.notFound("Batch not found.");

        const course = await courseRepository.findById(String(batch.courseId));
        if (!course) throw ApiError.notFound("Course not found.");

        const student = await userRepository.findById(String(studentId));
        if (!student) throw ApiError.notFound("Student not found.");

        const paymentPayload: CreateOrderRequest = {
            order_amount: course.fee,
            order_currency: "INR",
            customer_details: {
                customer_id: student._id.toString(),
                customer_email: student.email,
                customer_phone: student.phone,
                customer_name: student.name,
            },
            cart_details: {
                cart_items: [
                    {
                        item_id: String(course._id),
                        item_name: course.name,
                        item_quantity: 1,
                        item_currency: "INR",
                        item_original_unit_price: course.fee,
                        item_discounted_unit_price: course.fee,
                    },
                ],
            },
            order_expiry_time: moment().add(1, "hour").toISOString(),
            order_note: `Enrolled for ${course.name}`,
        };

        const response = await cashfreeService.createOrder(paymentPayload);
        await paymentService.create({
            tenantId: course.tenantId,
            studentId: student._id,
            batchId: batchId,
            order_id: response.order_id,
            amount: course.fee,
            currency: "INR",
        });



        return response;
    }

    public async update(
        filter: Record<string, any>,
        data: Partial<IEnrollmentDocument>
    ): Promise<IEnrollmentDocument> {
        const updated = await enrollmentRepository.update(filter, data);
        if (!updated) throw ApiError.internal("Failed to update enrollment.");
        return updated;
    }

    public async getByStudent(studentId: string): Promise<IEnrollmentDocument[]> {
        return enrollmentRepository.model
            .find({
                studentId: new mongoose.Types.ObjectId(studentId),
                status: { $ne: "cancelled" },
            })
            .populate("batchId")
            .lean();
    }

    public async getByBatch(batchId: string): Promise<IEnrollmentDocument[]> {
        return enrollmentRepository.model
            .find({
                batchId: new mongoose.Types.ObjectId(batchId),
                status: { $ne: "cancelled" },
            })
            .populate("studentId")
            .lean();
    }

    public async configStudentBatch(
        batchId: Types.ObjectId,
        studentId: Types.ObjectId,
        isRemove: boolean = false
    ): Promise<{ batch: IBatchDocument; student: any }> {
        const batch = await batchRepository.findById(batchId.toString());
        if (!batch) {
            throw ApiError.badRequest('Invalid batch Id.');
        }

        const student = await studentMetaService.getStudentMeta(studentId);
        if (!student) {
            throw ApiError.notFound("Student not found.");
        }

        if (!batch.studentIds) batch.studentIds = [];
        if (!student.batchIds) student.batchIds = [];

        const isExistInBatch = batch.studentIds.some(
            (id) => id.toString() === studentId.toString()
        );

        if (isExistInBatch && !isRemove) {
            throw ApiError.conflict("You have already purchased this batch.");
        }

        if (!isExistInBatch && isRemove) {
            throw ApiError.notFound("Student is not enrolled in this batch.");
        }

        if (isRemove) {
            batch.studentIds = batch.studentIds.filter(
                (id) => id.toString() !== studentId.toString()
            );
            student.batchIds = student.batchIds.filter(
                (id) => id.toString() !== batchId.toString()
            );
        } else {
            batch.studentIds.push(studentId);
            student.batchIds.push(batchId);
        }

        await Promise.all([
            batch.save({ validateBeforeSave: false }),
            student.save({ validateBeforeSave: false }),
        ]);

        return { batch, student };
    }

}

const enrollmentService = new EnrollmentService();
export default enrollmentService;
