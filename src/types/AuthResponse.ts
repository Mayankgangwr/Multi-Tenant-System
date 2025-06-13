import { Request } from "express";
import { IUserDocument } from "../models/user.model";
import { UserRoles } from "../constants";


export interface IAuthResponse {
    user: IUserDocument;
    accessToken: string;
    refreshToken: string
}

export interface AuthRequest extends Request {
    user?: IUserDocument;
}

export interface IScopeCheckProps {
    tenant?: boolean;
    branch?: boolean;
}

export interface IAccessOptions {
    roles?: UserRoles[];
    scope?: IScopeCheckProps;
}