import mongoose from "mongoose";
import enrollmentRepository from "../repositories/enrollment.repository";
import { IEnrollmentDocument } from "../models/enrollment.model";
import ApiError from "../utils/apiError";
import batchRepository from "../repositories/batch.repository";
import courseRepository from "../repositories/course.repository";
import userRepository from "../repositories/user.repository";
import cashfreeService from "./cashfree.service";
import { CreateOrderRequest } from "cashfree-pg";
import moment from "moment";
class EnrollmentService {
    /**
     * Create a new enrollment for a student in a batch.
     * Checks if already enrolled before creating.
     */
    public async create(data: Partial<IEnrollmentDocument>): Promise<{
        paymentUrl: string;
        orderId: string;
        paymentSessionId: string;
        enrollmentId: string;
    }> {
        const { studentId, batchId } = data;

        if (!studentId || !batchId) {
            throw ApiError.badRequest("Student and batch both IDs are required.");
        }

        const existingEnrollment = await enrollmentRepository.model.findOne({
            studentId,
            batchId,
            status: { $ne: "cancelled" },
        });

        if (existingEnrollment)
            throw ApiError.badRequest(
                "Student is already enrolled in this batch."
            );

        const batch = await batchRepository.findById(String(batchId));
        if (!batch) throw ApiError.notFound("Batch not found.");

        const course = await courseRepository.findById(String(batch.courseId));
        if (!course) throw ApiError.notFound("Course not found.");

        const student = await userRepository.findById(String(studentId));
        if (!student) throw ApiError.notFound("Student not found.");

        // Create enrollment
        const enrollmentPayload: Partial<IEnrollmentDocument> = {
            studentId,
            batchId,
            fee: {
                amount: course.fee,
                currency: "INR",
                paid: 0,
                due: course.fee,
                status: "unpaid",
            },
        };

        const enrollment = await enrollmentRepository.create(enrollmentPayload);
        if (!enrollment?._id) {
            throw ApiError.internal("Failed to create enrollment.");
        }

        // Update batch
        if (!batch.studentIds.includes(studentId)) {
            batch.studentIds.push(studentId);
        }
        await batch.save({ validateBeforeSave: false });

        // Update student
        if (!student.batchIds?.includes(batchId)) {
            student.batchIds?.push(batchId);
        }
        await student.save({ validateBeforeSave: false });

        // Build Cashfree order payload
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
            order_meta: {
                return_url:
                    `https://www.cashfree.com/devstudio/preview/pg/seamless?order_id={order_id}`,
                notify_url:
                    `https://www.cashfree.com/devstudio/preview/pg/webhooks/20510240`,
            },
        };

        // Create order in Cashfree
        const createdPaymentOrder = await cashfreeService.createOrder(paymentPayload);
        if (!createdPaymentOrder?.payment_session_id || !createdPaymentOrder?.order_id) {
            throw ApiError.internal("Failed to create payment order.");
        }

        // Save order/session IDs in enrollment
        enrollment.cashfreeOrderId = createdPaymentOrder.order_id;
        enrollment.paymentSessionId = createdPaymentOrder.payment_session_id;
        await enrollment.save();

        // Pay order
        const paymentResponse = await cashfreeService.payOrder(
            createdPaymentOrder.payment_session_id
        );

        if (!paymentResponse?.data?.url) {
            throw ApiError.internal("Failed to initiate payment.");
        }
        return {
            paymentUrl: paymentResponse.data.url,
            orderId: createdPaymentOrder?.[`order_id`],
            paymentSessionId: createdPaymentOrder.payment_session_id,
            enrollmentId: enrollment._id.toString(),
        };
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
