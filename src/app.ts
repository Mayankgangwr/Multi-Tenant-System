import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectRedis } from "./config/redis.config";

const app: Application = express();

app.use(
    cors({
        origin: "http://localhost:5173", // ✅ Your React frontend's origin
        credentials: true,              // ✅ Allow cookies and auth headers
    })
);
3
// app.use(cors({
//     origin: "*",  // or ["http://192.168.1.33:5173", "http://localhost:5173"]
//     credentials: true,
// }));
app.use(
    express.json({
        limit: '20kb',
        verify: (req: any, res, buf) => {
            req.rawBody = buf.toString();
        },
    })
);

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// connect to Redis
connectRedis();

import userRoutes from "./routes/user.routes";
import tenantRoutes from "./routes/tenant.routes";
import planRoute from "./routes/plan.routes";
import subscriptionRoute from "./routes/subscription.routes";
import courseRoute from "./routes/course.routes";
import branchRoute from "./routes/branch.routes";
import batchRoute from "./routes/batch.route";
import TeacherRoute from "./routes/teacher.route";
import StudentRoute from "./routes/student.route";
import AttendanceRoute from "./routes/attendance.routes";
import ClassSessionRoute from "./routes/class-session.routes";
import AssignmentRoute from "./routes/assignment.routes";
import SubmitAssignmentRoute from "./routes/submitted-assignment.routers";


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/subscription-plans", planRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/branches", branchRoute);
app.use("/api/v1/batches", batchRoute);
app.use("/api/v1/teachers", TeacherRoute);
app.use("/api/v1/students", StudentRoute);
app.use("/api/v1/attendance", AttendanceRoute);
app.use("/api/v1/classes", ClassSessionRoute);
app.use("/api/v1/assignments", AssignmentRoute);
app.use("/api/v1/submitted-assignment", SubmitAssignmentRoute)

app.get('/', (_req, res) => {
    res.send('Hello from TypeScript + MongoDB API');
});

import { errorHandler } from "./middlewares/errorHandler.middleware";
app.use(errorHandler);

export default app;