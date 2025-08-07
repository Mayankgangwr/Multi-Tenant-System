import { Router } from "express";
import { getClassSessionById, getClassSessionByStudentId, insertClassSession, updateClassSession } from "../controllers/class-session.controller";

const router = Router();

router.post("/", insertClassSession);

router.patch("/:classId", updateClassSession);

router.get("/", getClassSessionByStudentId);

router.get("/:classId", getClassSessionById);

export default router;