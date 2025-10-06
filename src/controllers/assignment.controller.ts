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

export const getAssignments = asyncHandler(async (req: AuthRequest, res: Response) => {
    const studentId = req.user?._id?.toString();
    const assignments = await assignmentService.getAssignments(studentId);
    res.status(200).json({ statusCode: 200, status: true, data: assignments, message: "Assignments fetched successfully." });
});

export const getAssignmentById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const assignmentId = req.params.assignmentId as string;
    const studentId = req.user?._id?.toString();
    if (!assignmentId) throw ApiError.badRequest("Assignment id is required");
    const classSession = await assignmentService.getAssignmentById(assignmentId, studentId);
    res.status(200).json({ statusCode: 200, status: true, data: classSession, message: "Assignment fetched successfully." });
});