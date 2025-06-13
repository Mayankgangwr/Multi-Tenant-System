import mongoose from "mongoose";
import { z } from "zod";


// ObjectId validator
export const objectId = (message: string = "Invalid Id") =>
    z.string().trim().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message,
    });

// Route param schema
export const idParamSchema = z.object({
    id: objectId(),
});