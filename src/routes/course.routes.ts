import { Router } from "express";
import {
    insertCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    hardDeleteCourse
} from "../controllers/course.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { createCourseSchema, updateCourseSchema } from "../validators/course.schema";
import { UserRoles } from "../constants";

const router = Router();

// Create a new course
router.post("/",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ body: createCourseSchema }),
    insertCourse
);

// Get all courses
router.get("/",
    verifyToken,
    // tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    getAllCourses
);

// Get course by ID
router.get("/:id",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema }),
    getCourseById
);

// Update course
router.patch("/:id",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ body: updateCourseSchema, params: idParamSchema }),
    updateCourse
);

// Soft delete course
router.delete("/:id",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema }),
    deleteCourse
);

// Hard delete course
router.delete("/:id/hard",
    verifyToken,
    tenantAccess([UserRoles.SuperAdmin]),
    validate({ params: idParamSchema }),
    hardDeleteCourse
);

export default router;
