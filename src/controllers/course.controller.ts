import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import courseService from "../services/course.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";
import filesServices from "../services/files.service";

export const insertCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const payload = { ...req.body };
    const bannerImage = req.file ? req.file.path : '';
    if (!bannerImage) throw ApiError.badRequest("Banner file is required");

    const banner = await filesServices.upload(bannerImage);
    if (!banner) throw new ApiError(400, "Failed to upload banner to Cloudinary");

    payload.banner = banner[0].url;
    const course = await courseService.create(payload);
    res.status(201).json({ statusCode: 201, status: true, data: course, message: "Course created successfully." });
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    if (!courseId) throw ApiError.badRequest("Course ID is required.");

    const payload = { ...req.body };
    if (req.file) {
        const bannerImage = req.file.path;

        const banner = await filesServices.upload(bannerImage);
        if (!banner) {
            throw new ApiError(400, "Failed to upload banner to Cloudinary");
        }

        payload.banner = banner[0].url;
    }
    const course = await courseService.update(courseId, payload);
    res.status(200).json({ statusCode: 200, status: true, data: course, message: "Course updated successfully." });
});

export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const course = await courseService.getById(courseId);
    res.status(200).json({ statusCode: 200, status: true, data: course, message: "Course fetched successfully." });
});

export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
    const courses = await courseService.getAll(req.query);
    res.status(200).json({ statusCode: 200, status: true, data: courses, message: "Course list fetched successfully." });
});

export const getAllTenantCourses = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.params.tenantId;
    if (!tenantId) throw ApiError.badRequest('Organization id missing.');
    const courses = await courseService.getAll({ ...req.query, tenantId });
    res.status(200).json({ statusCode: 200, status: true, data: courses, message: "Course list fetched successfully." });
});


export const deleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const courseId = req.params.id;
    const tenantId = req.user?.tenantId
    if (!tenantId) throw ApiError.unauthorized("Tenant id is required.");
    const result = await courseService.delete(courseId, tenantId);
    res.status(200).json({ statusCode: 200, status: result, message: "Course deleted successfully." });
});

export const hardDeleteCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const courseId = req.params.id;
    const tenantId = req.user?.tenantId
    if (!tenantId) throw ApiError.unauthorized("Tenant id is required.");
    const result = await courseService.hardDelete(courseId, tenantId);
    res.status(200).json({ statusCode: 200, status: result, message: "Course permanently deleted." });
});
