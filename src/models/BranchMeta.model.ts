import mongoose, { Schema } from "mongoose";

export interface IBranchMetaDocument extends Document {
    branchId: mongoose.Schema.Types.ObjectId;
    timeZone: string;
    holidays: string[]; // dates as ISO
    weeklyOff: string[]; // ['Sunday', 'Saturday']
}

const branchMetaSchema: Schema<IBranchMetaDocument> = new mongoose.Schema<IBranchMetaDocument>(
    {
        branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, unique: true },
        timeZone: { type: String, default: "Asia/Kolkata" },
        holidays: [{ type: String }],
        weeklyOff: [{ type: String }],
    },
    {
        timestamps: true
    }
);


const BranchMeta = mongoose.model<IBranchMetaDocument>("BranchMeta", branchMetaSchema);

export default BranchMeta;