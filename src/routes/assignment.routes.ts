import { Router } from "express";
import { getAssignmentById, getAssignments, insertAssignment } from "../controllers/assignment.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { UserRoles } from "../constants";
const router = Router();

router.post("/", insertAssignment);

router.get("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.Student]),
    getAssignments
);

router.get("/:assignmentId", verifyToken, getAssignmentById);

export default router;