import { Router } from "express";
import {
    deleteCourse,
    getAllCourses,
    getCourseById,
    hardDeleteCourse,
    insertCourse,
    updateCourse
} from "../controllers/course.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
// import {tenantAccess} from "../middlewares/tenant.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { createCourseSchema, updateCourseSchema } from "../validators/course.schema";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";

const router = Router();

router.post("/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ body: createCourseSchema }),
    insertCourse
);

router.get("/",
    getAllCourses
);

router.get("/:id",
    validate({ params: idParamSchema }),
    getCourseById
);

router.patch("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ body: updateCourseSchema, params: idParamSchema }),
    updateCourse
);

router.delete("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ params: idParamSchema }),
    deleteCourse
);

router.delete("/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    tenantAccess,
    validate({ params: idParamSchema }),
    hardDeleteCourse
);

export default router;
