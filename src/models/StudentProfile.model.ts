import mongoose, { Document, Schema } from "mongoose";

export interface IStudentProfileDocument extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    batchIds: mongoose.Schema.Types.ObjectId[];
    enrollmentDate: Date;
    guardianName: string;
    guardianPhone: string;
    feeStatus: "Paid" | "Pending" | "Partial";
}

const studentProfileSchema: Schema<IStudentProfileDocument> = new mongoose.Schema<IStudentProfileDocument>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Batch" }],
        enrollmentDate: { type: Date, required: true, default: Date.now },
        guardianName: { type: String },
        guardianPhone: { type: String },
        feeStatus: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
    },
    {
        timestamps: true
    }
);

const StudentProfile = mongoose.model<IStudentProfileDocument>("StudentProfile", studentProfileSchema);

export default StudentProfile;