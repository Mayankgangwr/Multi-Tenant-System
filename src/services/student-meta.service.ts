import mongoose from "mongoose";
import studentMetaRepository from "../repositories/student-meta.repository";
import { IStudentMetaDataDocument } from "../models/student-meta.model";
import ApiError from "../utils/apiError";

class StudentMetaService {
    public async create(data: Partial<IStudentMetaDataDocument>): Promise<IStudentMetaDataDocument> {
        const { userId } = data;
        const existingMeta = await studentMetaRepository.model.findOne({
            userId: new mongoose.Types.ObjectId(String(userId)),
            isDeleted: { $exists: false },
        });

        if (existingMeta) throw ApiError.badRequest("Already exists for this student.");

        const meta = await studentMetaRepository.create(data);
        if (!meta) throw ApiError.internal("Failed to create new student details.");
        return meta;
    }

    public async update(filter: Record<string, any>, data: Partial<IStudentMetaDataDocument>): Promise<IStudentMetaDataDocument> {
        const updatedMeta = await studentMetaRepository.update(filter, data);
        if (!updatedMeta) throw ApiError.internal("Failed to update student details.");
        return updatedMeta;
    }
}

const studentMetaService = new StudentMetaService();
export default studentMetaService;
