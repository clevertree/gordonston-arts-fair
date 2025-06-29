export class HttpError extends Error {
    readonly statusCode: number;
    readonly code?: string;
    readonly details?: Record<string, unknown>;

    constructor(
        statusCode: number,
        message: string,
        options?: {
            code?: string;
            details?: Record<string, unknown>;
        }
    ) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        this.code = options?.code;
        this.details = options?.details;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, HttpError);
    }

    toJSON() {
        return {
            error: {
                message: this.message,
                code: this.code,
                statusCode: this.statusCode,
                ...(this.details && { details: this.details })
            }
        };
    }

    static BadRequest(message = 'Bad Request', options?: { code?: string; details?: Record<string, unknown> }) {
        return new HttpError(400, message, options);
    }

    static Unauthorized(message = 'Unauthorized', options?: { code?: string; details?: Record<string, unknown> }) {
        return new HttpError(401, message, options);
    }

    static Forbidden(message = 'Forbidden', options?: { code?: string; details?: Record<string, unknown> }) {
        return new HttpError(403, message, options);
    }

    static NotFound(message = 'Not Found', options?: { code?: string; details?: Record<string, unknown> }) {
        return new HttpError(404, message, options);
    }

    static InternalServer(message = 'Internal Server Error', options?: { code?: string; details?: Record<string, unknown> }) {
        return new HttpError(500, message, options);
    }
}