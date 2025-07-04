import { ProjectionType } from "mongoose";
import { IPaginationOptions, IPaginationOptionsDTO } from "../types/comman";

export const generatePaginationDto = (query: any): IPaginationOptionsDTO => {
    const paginationDTO: IPaginationOptionsDTO = {
        page: 1,
        limit: 20,
        sortField: "createdAt",
        sortOrder: "desc",
        projection: [],
    };

    if (query.page) paginationDTO.page = query.page;
    if (query.limit) paginationDTO.limit = query.limit;
    if (query.sortField) paginationDTO.sortField = query.sortField;
    if (query.sortOrder) paginationDTO.sortOrder = query.sortOrder;
    if (query.projection) paginationDTO.projection = query.projection;
    return paginationDTO;

}

const generatePagination = <T>(paginationDTO: IPaginationOptionsDTO): IPaginationOptions<T> => {
    const {
        page = 1,
        limit = 20,
        sortField = "createdAt",
        sortOrder = "desc",
        projection = [],
    } = paginationDTO;

    const skip = (page - 1) * limit;

    const projectionObject: ProjectionType<T> = projection.reduce((acc: any, field: string) => {
        acc[field] = 1;
        return acc;
    }, {} as ProjectionType<T>);

    const order = sortOrder === "asc" ? 1 : -1
    return {
        skip,
        limit,
        sort: { [sortField]: order },
        projection: projectionObject,
    };
};

export const generatePaginationOptions = <T>(query: any): IPaginationOptions<T> => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.max(parseInt(query.limit) || 20, 1);
    const sortField = query.sortField || "createdAt";
    const sortOrder = (query.sortOrder || "desc").toLowerCase() === "asc" ? 1 : -1;

    let projection: string[] = [];
    if (query.projection) {
        if (Array.isArray(query.projection)) {
            projection = query.projection;
        } else if (typeof query.projection === "string") {
            projection = query.projection.split(",").map((f: string) => f.trim());
        }
    }

    const skip = (page - 1) * limit;

    const projectionObject: ProjectionType<T> = projection.reduce((acc, field) => {
        (acc as Record<string, 1>)[field] = 1;
        return acc;
    }, {} as ProjectionType<T>);

    return {
        skip,
        limit,
        sort: { [sortField]: sortOrder },
        projection: projectionObject,
    };
};

export default generatePagination;