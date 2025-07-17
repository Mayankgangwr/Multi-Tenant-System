import { Router } from "express";
import {
    createAttendance,
    deleteAttendance,
    hardDeleteAttendance,
    getAttendanceByStudent,
    getAttendanceByBatchAndDate,
    getAttendanceHistory,
    updateAttendanceStatus,
    getStudentSummary,
    getBatchSummary,
    deleteBatchAttendance,
} from "../controllers/attendance.controller";

import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { createAttendanceSchema, updateAttendanceSchema } from "../validators/attendance.schema";

const router = Router();

// Create
router.post(
    "/",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    tenantAccess,
    validate({ body: createAttendanceSchema }),
    createAttendance
);

// Delete (soft)
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    validate({ params: idParamSchema() }),
    deleteAttendance
);

// Delete (hard)
router.delete(
    "/:id/hard",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin]),
    validate({ params: idParamSchema() }),
    hardDeleteAttendance
);

// Get by student
router.get(
    "/student/:studentId",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    getAttendanceByStudent
);

// Get by batch & date
router.get(
    "/batch/:batchId",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    getAttendanceByBatchAndDate
);

// History (tenant)
router.get(
    "/history",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager]),
    getAttendanceHistory
);

// Update status & remarks
router.patch(
    "/:id",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    tenantAccess,
    validate({ body: updateAttendanceSchema, params: idParamSchema() }),
    updateAttendanceStatus
);

// Student summary
router.get(
    "/student/:studentId/summary",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    // validate({ params: idParamSchema() }),
    getStudentSummary
);

// Batch summary
router.get(
    "/batch/:batchId/summary",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin, UserRoles.BranchManager, UserRoles.Teacher]),
    // validate({ params: idParamSchema() }),
    getBatchSummary
);

// Delete all in batch
router.delete(
    "/batch/:batchId",
    verifyToken,
    authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
    validate({ params: idParamSchema() }),
    deleteBatchAttendance
);

export default router;
