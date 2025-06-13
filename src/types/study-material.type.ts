export interface CreateStudyMaterialDto {
  tenantId: string;
  courseId: string;
  uploadedBy: string;
  title: string;
  description?: string;
  tags?: string[];
  type: 'PDF' | 'Video' | 'Link';
  contentUrl: string;
  uploadedAt?: Date;
}

export interface UpdateStudyMaterialDto extends Partial<CreateStudyMaterialDto> {}
