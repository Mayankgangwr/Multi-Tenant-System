import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import enrollmentService from "../services/enrollment.service";
import mongoose from "mongoose";

/**
 * Enroll the authenticated student in a given batch
 * POST /batches/:batchId/enroll
 */
export const enrollInBatch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.params.batchId;
    const studentId = req.user?._id;

    if (!batchId) throw ApiError.badRequest("Batch ID is required.");
    if (!studentId) throw ApiError.unauthorized("Unauthorized request.");

    const data: any = {
        batchId: new mongoose.Types.ObjectId(batchId),
        studentId: new mongoose.Types.ObjectId(String(studentId)),
        enrolledAt: new Date(),
        status: "active", // you can adjust this based on your schema
    };

    const enrollment = await enrollmentService.create(data);

    res.status(201).json({
        statusCode: 201,
        status: true,
        data: enrollment,
        message: "Successfully enrolled in the batch.",
    });
});

/**
 * Update an enrollment
 * PATCH /enrollments/:enrollmentId
 */
export const updateEnrollment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const enrollmentId = req.params.enrollmentId;

    if (!enrollmentId) throw ApiError.badRequest("Enrollment ID is required.");

    const updated = await enrollmentService.update(
        { _id: new mongoose.Types.ObjectId(enrollmentId) },
        req.body
    );

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: updated,
        message: "Enrollment updated successfully.",
    });
});

/**
 * Get all enrollments of the logged-in student
 * GET /enrollments/my
 */
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

/**
 * Get all students enrolled in a specific batch
 * GET /batches/:batchId/students
 */
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
