import { Router } from "express";
import { getSubmittedAssignment, insertSubmittedAssignment } from "../controllers/submitted-assignment.controller";
import { uploadFile } from "../middlewares/multer.middleware";
import { verifyToken } from "../middlewares/Auth.middleware";

const router = Router();

router.post("/",
    uploadFile.array('attachments', 50),
    insertSubmittedAssignment
);

router.get("/:assignmentId",
    verifyToken,
    getSubmittedAssignment
);


export default router;
