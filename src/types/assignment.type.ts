import { Types } from "mongoose";

export interface IAssignmentDto {
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

export interface ISubmittedAssignmentDto {
    assignmentId: Types.ObjectId;
    studentId: Types.ObjectId;
    description?: string;
    files: string[];
    urls: string[];
    progress: number;
    completionStatus: 'pending' | 'full' | 'partial';
}