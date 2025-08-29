import { Router } from "express";
import { getAssignmentById, getAssignments, insertAssignment } from "../controllers/assignment.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
const router = Router();

router.post("/", insertAssignment);

router.get("/", verifyToken, getAssignments);

router.get("/:assignmentId", verifyToken, getAssignmentById);

export default router;