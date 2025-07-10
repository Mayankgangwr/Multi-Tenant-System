import { Router, Request, Response, NextFunction } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { enrollBatch, insertStudentMeta, updateStudentMeta } from "../controllers/student-meta.controller";
import { studentMetaSchema } from "../validators/student-meta.schema";
import { register } from "../controllers/user.controller";
import { registerSchema } from "../validators/user.schemas";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register",
    asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
        req.body.role = UserRoles.Student;
        next();
    }),
    validate({ body: registerSchema }),
    register
);

router.post("/profile",
    verifyToken,
    authorizeRoles([UserRoles.Student]),
    validate({ body: studentMetaSchema }),
    insertStudentMeta
);

router.patch("/profile",
    verifyToken,
    authorizeRoles([UserRoles.Student]),
    validate({ body: studentMetaSchema }),
    updateStudentMeta
);

router.post("/:batchId/enroll", 
    verifyToken,
    authorizeRoles([UserRoles.Student]),
    enrollBatch
);

export default router;
