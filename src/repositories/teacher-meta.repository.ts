import { ITeacherMetaDataDocument, TeacherMetaModel } from "../models/teacher-meta.schema";
import BaseRepository from "./base.repository";


class TeacherMetaRepository extends BaseRepository<ITeacherMetaDataDocument> {
    constructor() {
        super(TeacherMetaModel);
    }
}

const teacherMetaRepository = new TeacherMetaRepository();
export default teacherMetaRepository;