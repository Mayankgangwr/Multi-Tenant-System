import mongoose from "mongoose";
import classSessionService from "../services/class-session.service";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Response } from "express";
import ApiError from "../utils/apiError";

export const insertClassSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.body.batchId ? new mongoose.Types.ObjectId(req.body.batchId as string) : null;
    const tenantId = req.body.tenantId ? new mongoose.Types.ObjectId(req.body.tenantId as string) : null;
    if (!batchId || !tenantId) throw ApiError.badRequest("Batch and tenant id is requried");
    const classSession = await classSessionService.create({ ...req.body, batchId, tenantId });
    res.status(201).json({ statusCode: 201, status: true, data: classSession, message: "Class session created successfully." });
});

export const updateClassSession = asyncHandler(async (req: AuthRequest, res: Response) => {
    const classId = req.params.batchId as string;
    const batchId = req.body.batchId ? new mongoose.Types.ObjectId(req.body.batchId as string) : null;
    if (!classId || !batchId) throw ApiError.badRequest("Batch and class id both are required");
    const classSession = await classSessionService.update(classId, { ...req.body, batchId });
    res.status(201).json({ statusCode: 201, status: true, data: classSession, message: "Class session updated successfully." });
});

export const getClassSessionById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const classId = req.params.classId as string;
    if (!classId) throw ApiError.badRequest("Class id is required");
    const classSession = await classSessionService.getbyId(classId);
    res.status(201).json({ statusCode: 201, status: true, data: classSession, message: "Class session fetched successfully." });
});

export const getClassSessionByStudentId = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.query.studentId as string;
    if (!studentId) throw ApiError.badRequest("Class id is required");

    const classSession = await classSessionService.getAll({ ...req.query, studentId });
    res.status(201).json({ statusCode: 201, status: true, data: classSession, message: "Class session fetched successfully." });
});