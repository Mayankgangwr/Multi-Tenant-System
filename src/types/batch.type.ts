export interface CreateBatchDto {
  tenantId: string;
  courseId: string;
  branchId: string;
  teacherId: string;
  schedule: Date;
  maxCapacity?: number;
  isFull?: boolean;
  status?: boolean;
}

export interface UpdateBatchDto extends Partial<CreateBatchDto> {}