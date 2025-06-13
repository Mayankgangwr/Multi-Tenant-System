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

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/plans", planRoute);
app.use("/api/v1/subscriptions", subscriptionRoute);
app.use("/api/v1/courses", courseRoute);


app.get('/', (_req, res) => {
    res.send('Hello from TypeScript + MongoDB API');
});

import { errorHandler } from "./middlewares/errorHandler.middleware";
app.use(errorHandler);

export default app;