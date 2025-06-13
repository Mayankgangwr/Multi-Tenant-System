import { IUserDocument } from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { IAuthResponse } from "../types/AuthResponse";
import ApiError from "../utils/apiError";

class UserService {
    public async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
        const user = await userRepository.create(data);
        if (!user) throw ApiError.internal("Failed to create new user.");
        return user;
    }

    public async loginUser(email: string, password: string): Promise<IAuthResponse> {
        // Get user with password
        const user = await userRepository.findOneWithSencetiveFields({ email });
        if (!user) throw ApiError.notFound("User not found!");

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) throw ApiError.unauthorized("Invalid password!");

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();


        // Update login state and token
        const updatedUser = await userRepository.update(String(user._id), {
            isLoggedIn: true,
            refreshToken,
            lastLoginAt: new Date(),
        });

        if (!updatedUser) throw ApiError.notFound("User not found!.");

        return {
            user: updatedUser,
            accessToken,
            refreshToken
        };
    }

    public async logoutUser(id: string) {
        await userRepository.update(id, {
            isLoggedIn: false,
            refreshToken: undefined
        });
        return true;
    }
}

const userService = new UserService();
export default userService;
