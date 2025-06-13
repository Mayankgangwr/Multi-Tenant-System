export interface CreateBranchDto {
  tenantId: string;
  name: string;
  location: string;
  contactEmail?: string;
  phoneNumber?: string;
  timeZone: string;
  isMainBranch?: boolean;
  holidays?: string[];
  weeklyOff?: string[];
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {}
