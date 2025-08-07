import { ClassSessionModel, IClassSessionDocument } from "../models/class-session.model";
import BaseRepository from "./base.repository";


class ClassSessionRepository extends BaseRepository<IClassSessionDocument> {
    constructor() {
        super(ClassSessionModel);
    }
}

const classSessionRepository = new ClassSessionRepository();
export default classSessionRepository;