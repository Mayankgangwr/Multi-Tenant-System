import { ISubmittedAssignmentDocument, SubmittedAssignmentModel } from "../models/submitted-assignment.model";
import BaseRepository from "./base.repository";


class SubmittedAssignmentRepository extends BaseRepository<ISubmittedAssignmentDocument> {
    constructor() {
        super(SubmittedAssignmentModel);
    }
}

const submittedAssignmentRepository = new SubmittedAssignmentRepository();
export default submittedAssignmentRepository;