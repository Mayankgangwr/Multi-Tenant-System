import { Router } from "express";
import {
  insertSubscription,
  updateSubscription,
  getSubscriptionById,
  getAllSubscriptions,
  deleteSubscription,
  hardDeleteSubscription,
} from "../controllers/subscription.controller";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { createSubscriptionSchema, updateSubscriptionSchema } from "../validators/subscription.schema";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { tenantAccess } from "../middlewares/tenant.middleware";

const router = Router();

router.post("/",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
  tenantAccess,
  validate({ body: createSubscriptionSchema }),
  insertSubscription
);

router.get("/",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  getAllSubscriptions
);

router.get("/:id",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
  tenantAccess,
  validate({ params: idParamSchema() }),
  getSubscriptionById
);

router.patch("/:id",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
  tenantAccess,
  validate({ body: updateSubscriptionSchema, params: idParamSchema() }),
  updateSubscription
);

router.delete("/:id",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema() }),
  deleteSubscription
);

router.delete("/:id/hard",
  verifyToken,
  authorizeRoles([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema() }),
  hardDeleteSubscription
);

export default router;
