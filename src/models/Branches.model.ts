import mongoose, { Document, Schema } from "mongoose";

export interface IBranchDocument extends Document {
    tenantId: mongoose.Schema.Types.ObjectId;
    name: string;
    location: string;
}

const branchSchema: Schema<IBranchDocument> = new mongoose.Schema<IBranchDocument>(
    {
        tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const Branch = mongoose.model<IBranchDocument>("Branch", branchSchema);

export default Branch;