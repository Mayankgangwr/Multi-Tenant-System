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
import { createPlanSchema, updatePlanSchema } from "../validators/plan.schema";
import { authorizeRoles } from "../middlewares/Role.middleware";

const router = Router();

router.post(
  "/",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  validate({ body: createPlanSchema }),
  insertPlan
);

router.get(
  "/",
  getAllPlans
);

router.get(
  "/:id",
  validate({ params: idParamSchema() }),
  getPlanById
);

router.patch(
  "/:id",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema(), body: updatePlanSchema }),
  updatePlan
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema() }),
  deletePlan
);

router.delete(
  "/:id/hard",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema() }),
  hardDeletePlan
);

export default router;
