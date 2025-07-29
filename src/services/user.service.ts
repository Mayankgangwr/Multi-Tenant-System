import configENV from "../config/env.config";
import { IUserDocument } from "../models/user.model";
import userRepository from "../repositories/user.repository";
import { IAuthResponse } from "../types/AuthResponse";
import ApiError from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
class UserService {

    private async generateAccessAndRefereshToken(userId: any, isLoggedIn = false) {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User does not exist!");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        if (isLoggedIn) {
            user.isLoggedIn = true;
            user.lastLoginAt = new Date();
        }
        await user.save({ validateBeforeSave: false })
        if (isLoggedIn) {
            return { user, refreshToken, accessToken };
        }
        return { refreshToken, accessToken };

    }

    public async create(data: Partial<IUserDocument>): Promise<IUserDocument> {
        const user = await userRepository.create(data);
        if (!user) throw ApiError.internal("Failed to create new user.");
        return user;
    }

    public async loginUser(email: string, password: string): Promise<IAuthResponse> {
        // Get user with password
        const userData = await userRepository.findOneWithSencetiveFields({ email });
        if (!userData) throw ApiError.notFound("User not found!");

        const isMatch = await userData.isPasswordCorrect(password);
        if (!isMatch) throw ApiError.unauthorized("Invalid password!");

        const { user, accessToken, refreshToken } = await this.generateAccessAndRefereshToken(userData._id, true);
        if (!user) throw ApiError.notFound("User not found!");

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    public async logoutUser(id: string) {
        await userRepository.update(id, {
            isLoggedIn: false,
            refreshToken: null
        });
        return true;
    }

    public async refreshAccessToken(incomingRefreshToken: string) {
        const decodedToken = jwt.verify(incomingRefreshToken, String(configENV.refreshTokenSecret)) as JwtPayload;
        const user = await userRepository.model.findById(decodedToken.id);

        if (!user) throw ApiError.notFound("User does not exist!");
        if (incomingRefreshToken !== user?.refreshToken) throw ApiError.unauthorized('Refresh token is expired or used.');

        const { accessToken, refreshToken } = await this.generateAccessAndRefereshToken(user._id);

        return { accessToken, refreshToken };
    }

    public async changePassword(userId: string, oldPassword: string, newPassword: string) {
        const user = await userRepository.model.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) throw ApiError.badRequest('Invalid password');

        user.password = newPassword;

        await user.save({ validateBeforeSave: false });
        return true;
    }

    public async getCurrentuUser(userId: string) {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");
        return user;
    }

    public async updateUserDetails(userId: string, userData: Partial<IUserDocument>) {

        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");
        const { name, username, email, phone, profileImage, role, refreshToken, lastLoginAt, isLoggedIn, status, isDelete } = userData;
        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (profileImage) user.profileImage = profileImage;
        if (refreshToken) user.refreshToken = refreshToken;
        if (lastLoginAt) user.lastLoginAt = lastLoginAt;
        if (isLoggedIn) user.isLoggedIn = isLoggedIn;
        if (status) user.status = status;
        if (isDelete) user.isDelete = isDelete;
        await user.save({ validateBeforeSave: false });
        return user;
    }
}

const userService = new UserService();
export default userService;
