export interface CreateCourseDto {
  tenantId: string;
  name: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  fee: number;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}
