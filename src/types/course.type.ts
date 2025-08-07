export interface ISubject {
  title: string;
  description?: string;
}
export interface CreateCourseDto {
  tenantId: string;
  name: string;
  description?: string;
  category?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  fee: number;
  subjects?: ISubject[]
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}
