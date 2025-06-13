import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import courseService from "../services/course.service";
import ApiError from "../utils/apiError";
import { AuthRequest } from "../types/AuthResponse";

export const insertCourse = asyncHandler(async (req: AuthRequest, res: Response) => {
    const course = await courseService.create(req.body);
    res.status(201).json({ statusCode: 201, status: true, data: course, message: "Course created successfully." });
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    if (!courseId) throw ApiError.badRequest("Course ID is required.");

    const course = await courseService.update(courseId, req.body);
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

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const result = await courseService.delete(courseId);
    res.status(200).json({ statusCode: 200, status: result, message: "Course deleted successfully." });
});

export const hardDeleteCourse = asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.id;
    const result = await courseService.hardDelete(courseId);
    res.status(200).json({ statusCode: 200, status: result, message: "Course permanently deleted." });
});
