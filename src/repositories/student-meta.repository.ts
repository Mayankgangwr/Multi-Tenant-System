import { IStudentMetaDataDocument, StudentMetaModel } from "../models/student-meta.model";
import BaseRepository from "./base.repository";

class StudentMetaRepository extends BaseRepository<IStudentMetaDataDocument> {
    constructor() {
        super(StudentMetaModel);
    }
}

const studentMetaRepository = new StudentMetaRepository();
export default studentMetaRepository;
