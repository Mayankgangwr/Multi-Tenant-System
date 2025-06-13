export interface CreateAttendanceDto {
  tenantId: string;
  batchId: string;
  studentId: string;
  date: Date;
  status: boolean;
  remarks?: string;
}

export interface UpdateAttendanceDto extends Partial<CreateAttendanceDto> {}
