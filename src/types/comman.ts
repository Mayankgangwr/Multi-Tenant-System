import { ProjectionType } from "mongoose";

export type IPaginationOptions<T> = {
  skip: number;
  limit: number;
  sort: Record<string, 1 | -1>;
  projection: ProjectionType<T>;
}


export type IPaginationOptionsDTO = {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  projection?: string[]; // optional: list of field names to include
}
