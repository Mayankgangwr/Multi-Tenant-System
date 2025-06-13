import { UserRoles } from "../constants";

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  password: string;
  profileImage?: string;
  role: UserRoles;
  tenantId?: string;
  branchId?: string;
  refreshToken?: string;
  isLoggedIn?: boolean;
  status?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
