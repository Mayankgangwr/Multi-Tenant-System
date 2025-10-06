import { Types } from "mongoose";

export interface IClassSessionDto {
    tenantId: Types.ObjectId;
    batchId: Types.ObjectId;
    title: string;
    teacherId: Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isLive: boolean;
    streamLink: string;
}

export interface IUpcomingClassSession{
    
}