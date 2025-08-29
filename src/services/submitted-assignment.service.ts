import mongoose from "mongoose";
import { ISubmittedAssignmentDocument } from "../models/submitted-assignment.model";
import submittedAssignmentRepository from "../repositories/submitted-assignment.repository";
import { ISubmittedAssignmentDto } from "../types/assignment.type";
import ApiError from "../utils/apiError";
import filesServices from "./files.service";

class SubmittedAssignmentService {
    public async upsert(data: ISubmittedAssignmentDto): Promise<ISubmittedAssignmentDocument> {
        // ✅ Try to find existing submission for this student + assignment
        const submittedAssignment = await submittedAssignmentRepository.findOne({
            assignmentId: data.assignmentId,
            studentId: data.studentId,
            isDelete: false,
            status: true,
        });

        if (data?.removedExistingFiles) filesServices.cloudinaryDelete(data.removedExistingFiles);

        if (submittedAssignment) {
            // ✅ Update fields safely
            submittedAssignment.description = data.description;
            submittedAssignment.progress = data.progress;
            submittedAssignment.files = [...(data?.existingFiles || []), ...(data.files || [])];
            submittedAssignment.urls = data.urls || [];
            submittedAssignment.completionStatus = data.completionStatus;

            const saved = await submittedAssignment.save(); // ✅ must await
            if (!saved) throw ApiError.internal("Failed to update assignment!");
            return saved;
        }

        // ✅ Create new submission if not found
        const response = await submittedAssignmentRepository.create(data);
        if (!response) throw ApiError.internal("Failed to submit assignment!");
        return response;
    }

    public async getSubmittedAssignment(assignmentId: string, studentId: string): Promise<ISubmittedAssignmentDocument> {
        const submittedAssignment = await submittedAssignmentRepository.findOne({
            assignmentId: new mongoose.Types.ObjectId(assignmentId),
            studentId: new mongoose.Types.ObjectId(studentId),
            isDelete: false,
            status: true,
        });

        if (!submittedAssignment) throw ApiError.internal("assignment not found!");
        return submittedAssignment;
    }

}

const submittedAssignmentService = new SubmittedAssignmentService();
export default submittedAssignmentService;
