import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import enrollmentService from "../services/enrollment.service";

export const getMyEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.user?._id;

    if (!studentId) throw ApiError.unauthorized("Unauthorized request.");

    const enrollments = await enrollmentService.getByStudent(String(studentId));

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: enrollments,
        message: "Fetched your enrollments successfully.",
    });
});

export const getBatchEnrollments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.params.batchId;

    if (!batchId) throw ApiError.badRequest("Batch ID is required.");

    const enrollments = await enrollmentService.getByBatch(batchId);

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: enrollments,
        message: "Fetched batch enrollments successfully.",
    });
});
