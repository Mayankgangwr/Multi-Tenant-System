export interface CreateTeacherMetaDto {
  userId: string;
  batchIds?: string[];
  qualification: string;
  specialization?: string[];
  experience?: string;
  certifications?: string[];
  joinedAt: Date;
}

export interface UpdateTeacherMetaDto extends Partial<CreateTeacherMetaDto> {}
