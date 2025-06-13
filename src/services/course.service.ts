import { ICourseDocument } from "../models/course.model";
import courseRepository from "../repositories/course.repository";
import ApiError from "../utils/apiError";
import { buildCourseFilter } from "../utils/base-filter.util";

class CourseService {
    public async create(data: Partial<ICourseDocument>): Promise<ICourseDocument> {
        const existingCourse = await courseRepository.model.findOne({
            name: data.name,
            tenantId: data.tenantId,
            deletedAt: { $exists: false },
        });

        if (existingCourse) {
            throw ApiError.badRequest("Course with the same name already exists for this tenant.");
        }

        const course = await courseRepository.create(data);
        if (!course) throw ApiError.internal("Failed to create new course.");
        return course;
    }

    public async update(courseId: string, data: Partial<ICourseDocument>): Promise<ICourseDocument> {
        const existingCourse = await courseRepository.model.findOne({
            _id: { $ne: courseId }, 
            name: data.name,
            tenantId: data.tenantId,
            deletedAt: { $exists: false },
        });

        if (existingCourse) {
            throw ApiError.badRequest("Another course with the same name already exists for this tenant.");
        }

        const course = await courseRepository.model.findByIdAndUpdate(courseId, data, { new: true });
        if (!course) throw ApiError.notFound(`No course found with ID "${courseId}".`);
        return course;
    }


    public async getById(courseId: string): Promise<ICourseDocument> {
        const course = await courseRepository.findById(courseId);
        if (!course) throw ApiError.notFound(`No course found with ID "${courseId}".`);
        return course;
    }

    public async getAll(filter: Record<string, any>): Promise<ICourseDocument[]> {
        const filterQuery = buildCourseFilter(filter);
        const courses = await courseRepository.findAll(filterQuery);
        if (!courses || courses.length === 0) {
            throw ApiError.notFound("No courses found.");
        }
        return courses;
    }

    public async delete(id: string): Promise<boolean> {
        const isDeleted = await courseRepository.delete(id);
        if (!isDeleted) throw ApiError.internal("Failed to delete course.");
        return true;
    }

    public async hardDelete(id: string): Promise<boolean> {
        const isDeleted = await courseRepository.hardDelete(id);
        if (!isDeleted) throw ApiError.internal("Failed to hard delete course.");
        return true;
    }
}

const courseService = new CourseService();
export default courseService;
