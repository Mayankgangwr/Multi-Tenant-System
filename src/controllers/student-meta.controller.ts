import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import studentMetaService from "../services/student-meta.service";
import mongoose from "mongoose";
import enrollmentService from "../services/enrollment.service";

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

export const enrollBatch = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.params.batchId ? new mongoose.Types.ObjectId(req.params.batchId) : undefined;
    const studentId = req.user?._id || undefined;
    await enrollmentService.create({ ...req.body, batchId, studentId });

    res.status(200).json({
        statusCode: 200,
        status: true,
        message: "Student has been  enrolled successfully.",
    });


});
