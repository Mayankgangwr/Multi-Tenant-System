export interface CreateSubscriptionDto {
    planId: string;
    tenantId: string;
    startedAt: Date;
    endDate?: Date;
    isExpired?: boolean;
    paymentStatus?: 'Pending' | 'Paid' | 'Failed';
}

export interface UpdateSubscriptionDto extends Partial<CreateSubscriptionDto> { }
