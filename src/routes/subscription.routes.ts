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
import { tenantAccess } from "../middlewares/tenant.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { idParamSchema } from "../validators/IdParam.schema";
import { createSubscriptionSchema, updateSubscriptionSchema } from "../validators/subscription.schema";
import { UserRoles } from "../constants";

const router = Router();

router.post("/",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin]),
  validate({ body: createSubscriptionSchema }),
  insertSubscription
);

router.get("/",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin]),
  getAllSubscriptions
);

router.get("/:id",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
  validate({ params: idParamSchema }),
  getSubscriptionById
);

router.patch("/:id",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin, UserRoles.TenantAdmin]),
  validate({ body: updateSubscriptionSchema, params: idParamSchema }),
  updateSubscription
);

router.delete("/:id",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema }),
  deleteSubscription
);

router.delete("/:id/hard",
  verifyToken,
  tenantAccess([UserRoles.SuperAdmin]),
  validate({ params: idParamSchema }),
  hardDeleteSubscription
);

export default router;
