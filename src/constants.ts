export const DB_NAME = "learningNode";

export const options = {
    httpOnly: true,
    secure: true
}


export enum UserRoles {
    SuperAdmin = 'SuperAdmin',
    TenantAdmin = 'TenantAdmin',
    BranchManager = 'BranchManager',
    Teacher = 'Teacher',
    Student = 'Student'
}
export const Roles = ["SuperAdmin", "TenantAdmin", "BranchManager", "Teacher", "Student"] as const;

export type Role = (typeof UserRoles)[keyof typeof UserRoles];
