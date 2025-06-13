export interface CreatePaymentDto {
  tenantId: string;
  studentId: string;
  amount: number;
  date: Date;
  status: 'Pending' | 'Failed' | 'Done';
  method: 'Cash' | 'UPI' | 'NetBanking';
  invoiceId?: string;
  transactionId?: string;
  paymentGateway?: string;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {}
