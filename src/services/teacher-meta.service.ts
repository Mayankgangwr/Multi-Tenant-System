import mongoose from "mongoose";
import teacherMetaRepository from "../repositories/teacher-meta.repository";
import { ITeacherMetaDataDocument } from "../models/teacher-meta.schema";
import ApiError from "../utils/apiError";

class TeacherMetaService {
    public async create(data: Partial<ITeacherMetaDataDocument>): Promise<ITeacherMetaDataDocument> {
        const { userId } = data;
        const existingMeta = await teacherMetaRepository.model.findOne({
            userId: new mongoose.Types.ObjectId(String(userId)),
            isDeleted: { $exists: false },
        });

        if (existingMeta) throw ApiError.badRequest("already exists for this teacher details.");

        const meta = await teacherMetaRepository.create(data);
        if (!meta) throw ApiError.internal("Failed to create new teacher details.");
        return meta;
    }

    public async update(filter: Record<string, any>, data: Partial<ITeacherMetaDataDocument>): Promise<ITeacherMetaDataDocument> {
        const updatedMeta = await teacherMetaRepository.update(filter, data);
        if (!updatedMeta) throw ApiError.internal("Failed to create new teacher details.");
        return updatedMeta;
    }
}

const teacherMetaService = new TeacherMetaService();
export default teacherMetaService;