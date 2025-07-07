import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { insertStudentMeta, updateStudentMeta } from "../controllers/student-meta.controller";
import { studentMetaSchema } from "../validators/student-meta.schema";

const router = Router();

router.post("/",
    verifyToken,
    authorizeRoles([UserRoles.Student]),
    validate({ body: studentMetaSchema }),
    insertStudentMeta
);

router.patch("/",
    verifyToken,
    authorizeRoles([UserRoles.Student]),
    validate({ body: studentMetaSchema }),
    updateStudentMeta
);

export default router;
