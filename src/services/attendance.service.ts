import mongoose, { Types } from "mongoose";
import { IAttendanceDocument } from "../models/attendance.model";
import attendanceRepository from "../repositories/attendance.reository";
import ApiError from "../utils/apiError";
import { UserRoles } from "../constants";
import { IUserDocument } from "../models/user.model";
import batchRepository from "../repositories/batch.repository";
import { buildAttendanceFilter } from "../utils/base-filter.util";
import { generatePaginationOptions } from "../utils/pagination.util";
import moment from "moment";

class AttendanceService {
    async create(data: Partial<IAttendanceDocument>, user: IUserDocument) {
        if (user.role === UserRoles.Teacher && data.batchId) {
            const batch = await batchRepository.findById(data.batchId.toString());
            if (!batch) throw ApiError.badRequest("Invalid batch.");
            if (!batch.teacherId.equals(user._id)) {
                throw ApiError.unauthorized("You can only manage attendance for your own batch.");
            }
        }

        data.date = moment(moment().format('DD-MM-YYYY'), 'DD-MM-YYYY').toDate();

        const existingRecord = await attendanceRepository.findOne({
            tenantId: data.tenantId,
            batchId: data.batchId,
            studentId: data.studentId,
            date: data.date,
            isDeleted: { $exists: false },
        });

        if (existingRecord) {
            throw ApiError.badRequest(
                "Attendance already exists for this student in the specified batch and date."
            );
        }

        const attendance = await attendanceRepository.create(data);
        if (!attendance) {
            throw ApiError.internal("Failed to create attendance record.");
        }

        return attendance;
    }

    async delete(attendanceId: string, user: IUserDocument): Promise<boolean> {
        const attendance = await attendanceRepository.findOne({
            _id: attendanceId,
            isDeleted: { $exists: false },
        });

        if (!attendance) {
            throw ApiError.notFound("Attendance record not found.");
        }

        // If teacher, check if they own the batch
        if (user.role === UserRoles.Teacher) {
            const batch = await batchRepository.findById(attendance.batchId.toString());

            if (!batch) {
                throw ApiError.badRequest("Associated batch not found.");
            }

            if (!batch.teacherId.equals(user._id)) {
                throw ApiError.unauthorized("You can only delete attendance for your own batch.");
            }
        }

        if (!user?.tenantId) throw ApiError.badRequest("Tenant ID is required.");

        const isDeleted = await attendanceRepository.delete(attendanceId, user.tenantId);

        if (!isDeleted) {
            throw ApiError.internal("Failed to delete attendance record.");
        }

        return true;
    }

    async hardDelete(attendanceId: string, tenantId: Types.ObjectId): Promise<boolean> {
        const isDeleted = await attendanceRepository.hardDelete(attendanceId, tenantId);

        if (!isDeleted) {
            throw ApiError.internal("Failed to permanently delete attendance record.");
        }

        return true;
    }

    async getfilteredAttence(query: Record<string, any>) {
        const filterQuery = buildAttendanceFilter(query);
        const paginationOptions = generatePaginationOptions({ ...query, limit: 30 });
        const { skip, limit, sort } = paginationOptions;
        const attendance = await attendanceRepository.model.aggregate([
            { $match: filterQuery },
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
        ]).exec();
        return attendance;
    }

    async getByBatchAndDate(batchId: Types.ObjectId, date: Date) {
        return attendanceRepository.findAll({
            batchId,
            date,
            isDeleted: { $exists: false },
        });
    }

    async getHistory(tenantId: Types.ObjectId, filters: any = {}) {
        const query: any = { tenantId, isDeleted: { $exists: false }, ...filters };
        return attendanceRepository.findAll(query);
    }

    async updateStatus(attendanceId: string, status: boolean, remarks: string | undefined, user: IUserDocument) {

        const attendance = await attendanceRepository.findById(attendanceId);

        if (!attendance || attendance.isDeleted) throw ApiError.notFound("Attendance record not found.");

        if (user.role === UserRoles.Teacher) {
            const batch = await batchRepository.findById(attendance.batchId.toString());
            if (!batch) throw ApiError.badRequest("Invalid batch.");
            if (!batch.teacherId.equals(user._id)) {
                throw ApiError.unauthorized("You can only update attendance for your own batch.");
            }
        }

        const update: any = { status };
        if (remarks) update.remarks = remarks;

        const updated = await attendanceRepository.update(
            { _id: attendanceId },
            { $set: update }
        );

        if (!updated) {
            throw ApiError.internal("Failed to update attendance record.");
        }

        return true;
    }

    async getSummaryForStudent(studentId: Types.ObjectId) {
        const records = await attendanceRepository.model.aggregate([
            { $match: { studentId, isDeleted: { $exists: false } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const summary: Record<string, number> = { present: 0, absent: 0, total: 0 };
        records.forEach((r) => {
            if (r._id === true) summary.present = r.count;
            if (r._id === false) summary.absent = r.count;
            summary.total += r.count;
        });

        return summary;
    }

    async getBatchSummary(batchId: Types.ObjectId) {
        const records = await attendanceRepository.model.aggregate([
            { $match: { batchId, isDeleted: { $exists: false } } },
            {
                $group: {
                    _id: "$studentId",
                    total: { $sum: 1 },
                    present: {
                        $sum: {
                            $cond: [{ $eq: ["$status", true] }, 1, 0],
                        },
                    },
                    absent: {
                        $sum: {
                            $cond: [{ $eq: ["$status", false] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        return records.map((r) => ({
            studentId: r._id,
            total: r.total,
            present: r.present,
            absent: r.absent,
            attendancePercentage: r.total > 0 ? ((r.present / r.total) * 100).toFixed(2) : "0",
        }));
    }

    async deleteByBatch(batchId: Types.ObjectId) {
        const result = await attendanceRepository.model.updateMany(
            { batchId },
            { $set: { isDeleted: true } }
        );

        if (!result) {
            throw ApiError.internal("Failed to delete attendance records for batch.");
        }

        return true;
    }
}

export default new AttendanceService();
