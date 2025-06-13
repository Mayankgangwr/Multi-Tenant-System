export interface CreateStudentMetaDto {
  userId: string;
  batchIds?: string[];
  enrollmentDate: Date;
  dob?: Date;
  address?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  feeStatus?: 'Paid' | 'Pending' | 'Partial';
}

export interface UpdateStudentMetaDto extends Partial<CreateStudentMetaDto> {}
