import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectRedis } from "./config/redisConfig";

const app: Application = express();

app.use(
    cors({
        origin: process.env.LOCAL_CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "20kb" }));

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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/subscription-plans", planRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/branches", branchRoute);
app.use("/api/v1/batches", batchRoute);
app.use("/api/v1/teachers", TeacherRoute);


app.get('/', (_req, res) => {
    res.send('Hello from TypeScript + MongoDB API');
});

import { errorHandler } from "./middlewares/errorHandler.middleware";
app.use(errorHandler);

export default app;