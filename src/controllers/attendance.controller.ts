import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import attendanceService from "../services/attendance.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";
import mongoose from "mongoose";

export const createAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req?.user) throw ApiError.unauthorized("Unauthrirazed request.");
    const attendance = await attendanceService.create(req.body, req.user);
    res.status(201).json({
        statusCode: 201,
        status: true,
        data: attendance,
        message: "Attendance created successfully.",
    });
});

export const deleteAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const attendanceId = req.params.id;
    const user = req.user;
    if (!user) throw ApiError.unauthorized("Unauthrirazed request..");

    const result = await attendanceService.delete(attendanceId, user);
    res.status(200).json({
        statusCode: 200,
        status: result,
        message: "Attendance deleted successfully.",
    });
});

export const hardDeleteAttendance = asyncHandler(async (req: AuthRequest, res: Response) => {
    const attendanceId = req.params.id;
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw ApiError.unauthorized("Tenant id is required.");

    const result = await attendanceService.hardDelete(attendanceId, tenantId);
    res.status(200).json({
        statusCode: 200,
        status: result,
        message: "Attendance permanently deleted.",
    });
});

export const getAttendanceByStudent = asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    if (!studentId) throw ApiError.badRequest("Student ID is required.");

    const records = await attendanceService.getfilteredAttence({ ...req.query, studentId: new mongoose.Types.ObjectId(studentId), });

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: records,
        message: "Attendance records fetched successfully.",
    });
});

export const getAttendanceByBatchAndDate = asyncHandler(async (req: Request, res: Response) => {
    const batchId = req.params.batchId;
    const date = req.query.date as string;

    if (!batchId || !date) throw ApiError.badRequest("Batch ID and date are required.");

    const records = await attendanceService.getfilteredAttence({ ...req.query, batchId, date });

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: records,
        message: "Attendance records fetched successfully.",
    });
});

export const getAttendanceHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const tenantId = req.user?.tenantId;
    if (!tenantId) throw ApiError.unauthorized("Tenant id is required.");

    const records = await attendanceService.getfilteredAttence({ ...req.query, tenantId });

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: records,
        message: "Attendance history fetched successfully.",
    });
});

export const updateAttendanceStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const attendanceId = req.params.id;
    const { status, remarks } = req.body;
    if (!req?.user) throw ApiError.unauthorized("Unauthrirazed request.");

    if (typeof status !== "boolean") throw ApiError.badRequest("Status must be true or false.");

    const result = await attendanceService.updateStatus(
        attendanceId,
        status,
        remarks,
        req.user
    );

    res.status(200).json({
        statusCode: 200,
        status: result,
        message: "Attendance updated successfully.",
    });
});

export const getStudentSummary = asyncHandler(async (req: Request, res: Response) => {
    const studentId = req.params.studentId;

    if (!studentId) throw ApiError.badRequest("Student ID is required.");

    const summary = await attendanceService.getSummaryForStudent({ ...req.query, studentId });

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: summary,
        message: "Attendance summary fetched successfully.",
    });
});

export const getBatchSummary = asyncHandler(async (req: Request, res: Response) => {
    const batchId = req.params.batchId;

    if (!batchId) throw ApiError.badRequest("Batch ID is required.");

    const summary = await attendanceService.getBatchSummary({ ...req.query, batchId });

    res.status(200).json({
        statusCode: 200,
        status: true,
        data: summary,
        message: "Batch attendance summary fetched successfully.",
    });
});

export const deleteBatchAttendance = asyncHandler(async (req: Request, res: Response) => {
    const batchId = req.params.batchId;

    if (!batchId) throw ApiError.badRequest("Batch ID is required.");

    const result = await attendanceService.deleteByBatch(new mongoose.Types.ObjectId(batchId));

    res.status(200).json({
        statusCode: 200,
        status: result,
        message: "All attendance records for the batch deleted successfully.",
    });
});
