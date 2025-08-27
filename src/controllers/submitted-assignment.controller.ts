import { Response } from "express";
import { AuthRequest } from "../types/AuthResponse";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import ApiError from "../utils/apiError";
import submittedAssignmentService from "../services/submitted-assignment.service";
import filesServices from "../services/files.service";
import { ISubmittedAssignmentDto } from "../types/assignment.type";

export const insertSubmittedAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const assignmentId = req.body.assignmentId ? new mongoose.Types.ObjectId(req.body.assignmentId as string) : null;
    const studentId = req.body.studentId ? new mongoose.Types.ObjectId(req.body.studentId as string) : null;

    const payload: ISubmittedAssignmentDto = { ...req.body, assignmentId, studentId };

    const files = req.files as Express.Multer.File[];
    if (files.length) {
        const paths = files.map((f) => f.path);
        const uploaded = await filesServices.upload(paths);
        if (!uploaded?.length) throw new ApiError(400, "Failed to upload files to Cloudinary");
        const fileUrls = uploaded.map((file) => file.url);
        payload.files = fileUrls;
    }

    const submittedAssignment = await submittedAssignmentService.upsert(payload);
    res.status(201).json({ statusCode: 201, status: true, data: submittedAssignment, message: "Assignment submitted successfully." });
});

export const getSubmittedAssignment = asyncHandler(async (req: AuthRequest, res: Response) => {
    const assignmentId = req.params.assignmentId as string;
    const studentId = req.user?._id?.toString();
    if (!assignmentId || !studentId) throw ApiError.badRequest("Assignment and student id both are required");
    const submittedAssignment = await submittedAssignmentService.getSubmittedAssignment(assignmentId, studentId);
    res.status(201).json({ statusCode: 201, status: true, data: submittedAssignment, message: "Submitted Assignment fetched successfully." });
});