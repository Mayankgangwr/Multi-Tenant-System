
import { IEnrollmentDocument, EnrollmentModel } from "../models/enrollment.model";
import BaseRepository from "./base.repository";


class EnrollmentRepository extends BaseRepository<IEnrollmentDocument> {
    constructor() {
        super(EnrollmentModel);
    }
}

const enrollmentRepository = new EnrollmentRepository();
export default enrollmentRepository;