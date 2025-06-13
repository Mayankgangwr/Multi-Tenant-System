import { ICourseDocument, CourseModel } from "../models/course.model";
import BaseRepository from "./base.repository";


class CourseRepository extends BaseRepository<ICourseDocument> {
    constructor() {
        super(CourseModel);
    }
}

const courseRepository = new CourseRepository();
export default courseRepository;

