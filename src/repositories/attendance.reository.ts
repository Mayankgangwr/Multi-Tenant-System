import { IAttendanceDocument, AttendanceModel } from "../models/attendance.model";
import BaseRepository from "./base.repository";


class AttendanceRepository extends BaseRepository<IAttendanceDocument> {
    constructor() {
        super(AttendanceModel);
    }

}

const attendanceRepository = new AttendanceRepository();
export default attendanceRepository;