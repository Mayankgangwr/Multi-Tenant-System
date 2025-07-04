import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { insertTeacherMeta, updateTeacherMeta } from "../controllers/teacher-meta.controller";
import { teacherMetaSchema } from "../validators/teacher-meta.schema";

const router = Router();

router.post("/",
    verifyToken,
    authorizeRoles([UserRoles.Teacher]),
    validate({ body: teacherMetaSchema }),
    insertTeacherMeta
);

router.patch("/",
    verifyToken,
    authorizeRoles([UserRoles.Teacher]),
    validate({ body: teacherMetaSchema }),
    updateTeacherMeta
);

export default router;
