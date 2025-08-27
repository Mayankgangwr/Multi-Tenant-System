import { Schema, model, Document, Types } from 'mongoose';

export interface ISubmittedAssignmentDocument extends Document {
    assignmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    description?: string;
    files: string[];
    urls: string[];
    progress: number;
    completionStatus: 'pending' | 'full' | 'partial';
    isDelete: boolean;
    status: boolean;

}

const SubmittedAssignmentSchema = new Schema<ISubmittedAssignmentDocument>(
    {
        assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String },
        files: { type: [String], default: [] },
        urls: { type: [String], default: [] },
        progress: { type: Number, default: 0 },
        completionStatus: { type: String, enum: ['pending', 'full', 'partial'], default: "pending" },
        status: { type: Boolean, default: true },
        isDelete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// indexes
SubmittedAssignmentSchema.index({ assignmentId: 1, isDelete: 1 });
SubmittedAssignmentSchema.index({ assignmentId: 1, status: 1 });

export const SubmittedAssignmentModel = model<ISubmittedAssignmentDocument>('SubmittedAssignment', SubmittedAssignmentSchema);
