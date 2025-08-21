import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import assignmentService from "../services/assignment.service";
import ApiError from "../utils/apiError";

export const insertAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const batchId = req.body.batchId ? new mongoose.Types.ObjectId(req.body.batchId as string) : null;
    const createdBy = req.body.createdBy ? new mongoose.Types.ObjectId(req.body.createdBy as string) : null;
    const subjectId = req.body.subjectId ? new mongoose.Types.ObjectId(req.body.subjectId as string) : null;
    const tenantId = req.body.tenantId ? new mongoose.Types.ObjectId(req.body.tenantId as string) : null;
    const classSession = await assignmentService.create({ ...req.body, batchId, tenantId, subjectId, createdBy });
    res.status(201).json({ statusCode: 201, status: true, data: classSession, message: "Assignment created successfully." });
});

export const getAssignmentById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const assignmentId = req.params.assignmentId as string;
    if (!assignmentId) throw ApiError.badRequest("Assignment id is required");
    const classSession = await assignmentService.getAssignmentById(assignmentId);
    res.status(201).json({ statusCode: 201, status: true, data: classSession, message: "Assignment fetched successfully." });
});