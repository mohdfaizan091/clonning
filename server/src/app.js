import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const app = express();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {success: false, message: "Too many requests, please try again later."},
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    })
);

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

//health route
app.get("/home" , (req, res) => {
    res.status(200).json({ message: "ok" });
})
//sign-up route
import authRoutes from "./auth/auth.routes.js";
app.use("/api/auth", authRoutes);


import errorHandler from "./middlewares/error.middleware.js";
app.use(errorHandler);

//export app
export default app;