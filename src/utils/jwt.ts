import ApiError from "./apiError";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodeTokenOptions {
    secret: string;
}

export const decodedJWT = async (accessToken: string, options: DecodeTokenOptions): Promise<JwtPayload> => {
    if (!accessToken) throw ApiError.unauthorized("Unauthorized request");
    try {
        return jwt.verify(accessToken, options.secret) as JwtPayload;
    } catch (error) {
        throw ApiError.unauthorized("Invalid access token");
    }
};
