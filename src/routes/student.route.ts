import { Router, Request, Response, NextFunction } from "express";
import { verifyToken } from "../middlewares/Auth.middleware";
import { validate } from "../middlewares/Validate.middleware";
import { UserRoles } from "../constants";
import { authorizeRoles } from "../middlewares/Role.middleware";
import { enrollBatch, generatePaymentIntent, insertStudentMeta, updateStudentMeta } from "../controllers/student-meta.controller";
import { studentMetaSchema } from "../validators/student-meta.schema";
import { register } from "../controllers/user.controller";
import { registerSchema } from "../validators/user.schemas";
import { asyncHandler } from "../utils/asyncHandler";
import cashfreeService from "../services/cashfree.service";
import crypto from "crypto";
import paymentRepository from "../repositories/payment.repository";
import paymentService from "../services/payment.service";
import ApiError from "../utils/apiError";
import { getAllBatches } from "../controllers/batch.controller";

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

router.post("/:batchId/payment",
    // verifyToken,
    // authorizeRoles([UserRoles.Student]),
    generatePaymentIntent
);

router.post('/payment/webhook',
    enrollBatch
);

router.get('/payment/status',
    asyncHandler(async (req: Request, res: Response) => {
        const orderId = req.query.orderId as string;
        if (!orderId) throw ApiError.badRequest(`Order ID is required.`);

        const order = await paymentService.getByOrderId(orderId);

        res.status(200).json({
            statusCode: 200,
            status: true,
            data: order,
            message: "Order fetched successfully.",
        });
    })
);


router.get("/order/:orderId",
    asyncHandler(async (req: Request, res: Response) => {
        const { orderId } = req.params;
        const order = await paymentService.getByOrderId(orderId);
        res.status(200).json({
            statusCode: 200,
            status: true,
            data: order,
            message: "Order fetched successfully.",
        });
    })
);

router.get("/my-learning",
    verifyToken,
    authorizeRoles([UserRoles.Student]),
    getAllBatches
)

export default router;
