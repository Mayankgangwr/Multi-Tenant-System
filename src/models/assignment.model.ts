import { Schema, model, Document, Types } from "mongoose";

export interface IAssignmentDocument extends Document {
    tenantId: Types.ObjectId;
    batchId: Types.ObjectId;
    subjectId: Types.ObjectId; 
    title: string;
    description: string;
    instructions?: string;
    attachments?: string[];
    githubTemplateUrl?: string;
    dueDate: Date;
    maxGrade?: number;
    createdBy: Types.ObjectId;
    allowLateSubmission?: boolean;
    latePenaltyPercentage?: number;
}

const AssignmentSchema = new Schema<IAssignmentDocument>(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
        batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true }, 
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        instructions: { type: String },
        attachments: [{ type: String }],
        githubTemplateUrl: { type: String, trim: true },
        dueDate: { type: Date, required: true },
        maxGrade: { type: Number, default: 100 },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        allowLateSubmission: { type: Boolean, default: false },
        latePenaltyPercentage: { type: Number, default: 0 },
    },
    { timestamps: true }
);

AssignmentSchema.index({ tenantId: 1, batchId: 1, subjectId: 1, dueDate: 1 });

export const AssignmentModel = model<IAssignmentDocument>("Assignment", AssignmentSchema);
