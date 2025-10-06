import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import studentMetaService from "../services/student-meta.service";
import mongoose from "mongoose";
import enrollmentService from "../services/enrollment.service";
import cashfreeService from "../services/cashfree.service";
import { PGWebhookEvent } from "cashfree-pg";
import paymentService from "../services/payment.service";

export const insertStudentMeta = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw ApiError.unauthorized("Unauthorized request.");

    const userData = { ...req.body, userId };
    const meta = await studentMetaService.create(userData);

    res.status(201).json({
        statusCode: 201,
        status: true,
        data: meta,
        message: "Student profile created successfully.",
    });
});

export const updateStudentMeta = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw ApiError.unauthorized("Unauthorized request.");

    if ('userId' in req.body) delete req.body.userId;

    const meta = await studentMetaService.update({ userId }, { ...req.body });

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: meta,
        message: "Student profile updated successfully.",
    });
});

export const generatePaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.params.batchId ? new mongoose.Types.ObjectId(req.params.batchId) : undefined;
    const studentId = req.body.studentId ? new mongoose.Types.ObjectId(String(req.body.studentId)) : undefined;;
    if (!batchId || !studentId) throw ApiError.badRequest("Batch and student both id are required.")
    const paymentIntent = await enrollmentService.createPaymentIntent(batchId, studentId);
    res.status(200).json({
        statusCode: 200,
        data: paymentIntent,
        status: true,
        message: "Student has been  enrolled successfully.",
    });
});

export const enrollBatch = asyncHandler(async (req: any, res: Response) => {
    const rawBody = req.rawBody;
    let timestamp = req.headers["x-webhook-timestamp"];
    let signature = req.headers["x-webhook-signature"];
    if (!signature || !timestamp) throw new Error();
    if (Array.isArray(signature)) signature = signature[0];
    if (Array.isArray(timestamp)) timestamp = timestamp[0];

    const isValid: PGWebhookEvent | false = await cashfreeService.verifWebhook(signature, rawBody, timestamp);

    if (isValid) {
        const payment = await paymentService.handleWebhook(isValid.object);
        await enrollmentService.configStudentBatch(payment.batchId, payment.studentId);
    } else {
        console.error("❌ Webhook validation failed!");
    }

    res.sendStatus(200);
})
