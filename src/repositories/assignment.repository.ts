import { AssignmentModel, IAssignmentDocument } from "../models/assignment.model";
import BaseRepository from "./base.repository";


class AssignmentRepository extends BaseRepository<IAssignmentDocument> {
    constructor() {
        super(AssignmentModel);
    }
}

const assignmentRepository = new AssignmentRepository();
export default assignmentRepository;