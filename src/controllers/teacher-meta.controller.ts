import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import teacherMetaService from "../services/teacher-meta.service";

export const insertTeacherMeta = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw ApiError.unauthorized("Unauthorized request.");
    const userData = { ...req.body, userId };
    const meta = await teacherMetaService.create(userData);
    res.status(201).json({
        statusCode: 201,
        status: true,
        data: meta,
        message: "Teacher profile created successfully.",
    });
});

export const updateTeacherMeta = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw ApiError.unauthorized("Unauthorized request.");

    const plan = await teacherMetaService.update({ userId }, { ...req.body, userId });
    res.status(200).json({ statusCode: 200, status: true, data: plan, message: "Plan updated successfully." });
});