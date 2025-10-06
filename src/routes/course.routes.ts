import { Router } from "express";
import {
    deleteCourse,
    getAllCourses,
    getAllTenantCourses,
    getCourseById,
    hardDeleteCourse,
    insertCourse,
    updateCourse
} from "../controllers/course.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { createCourseSchema, updateCourseSchema } from "../validators/course.schema";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { uploadFile } from "../middlewares/multer.middleware";

const router = Router();

router.post("/",
    verifyToken,
    // authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    // tenantAccess,
    uploadFile.single('bannerImage'),
    // validate({ body: createCourseSchema }),
    insertCourse
);

router.get("/",
    // verifyToken,
    // authorizeRoles([UserRoles.SuperAdmin]),
    getAllCourses
);


router.get("/:id",
    validate({ params: idParamSchema() }),
    getCourseById
);

router.patch("/:id",
    verifyToken,
    uploadFile.single('bannerImage'),
    updateCourse
);

router.delete("/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema() }),
    deleteCourse
);

router.delete("/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema() }),
    hardDeleteCourse
);

export default router;
