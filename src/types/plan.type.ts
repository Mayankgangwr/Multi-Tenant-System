export interface CreatePlanDto {
    name: string;
    price: number;
    features: string[];
    duration: 'Monthly' | 'Yearly';
    offer?: Record<string, any>;
    maxUsers: number;
    trialPeriodDays?: number;
    isActive?: boolean;
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> { }