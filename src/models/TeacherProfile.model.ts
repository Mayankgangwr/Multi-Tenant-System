import mongoose, { Document, Schema } from "mongoose";

export interface ITeacherProfileDocument extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    batchIds: mongoose.Schema.Types.ObjectId[];
    qualification: string;
    specialization: string[];
    joinedAt: Date;
}

const teacherProfileSchema: Schema<ITeacherProfileDocument> = new mongoose.Schema<ITeacherProfileDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        qualification: { type: String, required: true },
        specialization: [{ type: String }],
        joinedAt: { type: Date, default: Date.now },
        batchIds: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
    },
    {
        timestamps: true
    }
);

const TeacherProfile = mongoose.model<ITeacherProfileDocument>("TeacherProfile", teacherProfileSchema);

export default TeacherProfile;