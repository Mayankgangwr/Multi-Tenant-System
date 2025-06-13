export interface CreateTenantDto {
    subscriptionId: string;
    name: string;
    email: string;
    contactPhone?: string;
    address?: string;
    domain?: string;
    logo?: string;
    status?: boolean;
}

export interface UpdateTenantDto extends Partial<CreateTenantDto> { }
