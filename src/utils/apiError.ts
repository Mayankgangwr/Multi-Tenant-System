class ApiError extends Error {
    statusCode: number;
    data: any | null;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = "Bad Request", errors: any[] = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized", errors: any[] = []) {
        return new ApiError(401, message, errors);
    }

    static forbidden(message = "Forbidden", errors: any[] = []) {
        return new ApiError(403, message, errors);
    }

    static notFound(message = "Not Found", errors: any[] = []) {
        return new ApiError(404, message, errors);
    }

    static conflict(message = "Conflict", errors: any[] = []) {
        return new ApiError(409, message, errors);
    }

    static unproccessable(message = "Unproccessable", errors: any[] = []) {
        return new ApiError(422, message, errors);
    }

    static internal(message = "Internal", errors: any[] = []) {
        return new ApiError(500, message, errors);
    }
}

export default ApiError;