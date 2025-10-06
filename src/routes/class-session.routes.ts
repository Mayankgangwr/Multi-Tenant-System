import { Router } from "express";
import { deleteClassSession, getClassSessionById, getClassSessionByStudentId, getClassSessions, getUpcommingClassSession, insertClassSession, updateClassSession } from "../controllers/class-session.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { UserRoles } from "../constants";

const router = Router();

router.post(
    "/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    insertClassSession
);

router.patch("/:classId", updateClassSession);

router.get("/",
    verifyToken,
    getClassSessions);

router.get("/:classId", getClassSessionById);

router.delete(
    "/:classId",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    deleteClassSession
);

router.get(
    "/upcoming",
    verifyToken,
    authorizeRoles([UserRoles.Teacher, UserRoles.Student]),
    getUpcommingClassSession
);

export default router;