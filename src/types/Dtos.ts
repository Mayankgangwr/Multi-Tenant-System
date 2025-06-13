import { Role } from "../constants";

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: Role;
    tenantId?: string;
    branchId?: string;
}

export interface CreateTenantDto {
    name: string;
    email: string;
    subscriptionPlan?: string;
}

export interface CreateBranchDto {
    tenantId: string;
    name: string;
    location: string;
}
