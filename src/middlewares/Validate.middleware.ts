// middleware/validate.ts
import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

interface ValidationSchemas {
    body?: ZodSchema;
    params?: ZodSchema;
}

export const validate = ({ body, params }: ValidationSchemas): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const errors: { path: string; message: string }[] = [];

        if (body) {
            const result = body.safeParse(req.body);
            if (!result.success) {
                errors.push(
                    ...result.error.errors.map((err) => ({
                        path: `body.${err.path.join(".")}`,
                        message: err.message,
                    }))
                );
            } else {
                req.body = result.data;
            }
        }

        if (params) {
            const result = params.safeParse(req.params);
            if (!result.success) {
                errors.push(
                    ...result.error.errors.map((err) => ({
                        path: `params.${err.path.join(".")}`,
                        message: err.message,
                    }))
                );
            } else {
                req.params = result.data;
            }
        }

        if (errors.length > 0) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors,
            });
            return;
        }

        next();
    };
};
