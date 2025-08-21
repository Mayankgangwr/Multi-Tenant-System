import { Router } from "express";
import { getAssignmentById, insertAssignment } from "../controllers/assignment.controller";
const router = Router();

router.post("/", insertAssignment);

router.get("/:assignmentId", getAssignmentById);

export default router;