import { Router } from "express";
import {
  insertPlan,
  getPlanById,
  getAllPlans,
  updatePlan,
  deletePlan,
  hardDeletePlan,
} from "../controllers/plan.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { UserRoles } from "../constants";
import { tenantAccess } from "../middlewares/tenant.middleware";
import { authorizeAccess } from "../middlewares/Role.middleware";
import { createPlanSchema, updatePlanSchema } from "../validators/plan.schema";

const router = Router();

// Create Plan
router.post(
  "/",
  verifyToken,
  authorizeAccess([UserRoles.SuperAdmin]),
  validate({ body: createPlanSchema }),
  insertPlan
);

// Get all plans
router.get(
  "/list",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin]),
  getAllPlans
);

// Get plan by ID
router.get(
  "/:id",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema }),
  getPlanById
);

// Update plan
router.patch(
  "/:id",
  verifyToken,
  authorizeAccess([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema, body: updatePlanSchema }),
  updatePlan
);

// Soft delete plan
router.delete(
  "/:id",
  verifyToken,
  authorizeAccess([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema }),
  deletePlan
);

// Hard delete plan
router.delete(
  "/:id/hard",
  verifyToken,
  authorizeAccess([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema }),
  hardDeletePlan
);

export default router;
