import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {success: false, message: "Too many requests, please try again later."},
});

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));  
  }

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
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

// application routes
import applicationRoutes from "./application/application.routes.js";
app.use("/api/applications", applicationRoutes);


import errorHandler from "./middlewares/error.middleware.js";
app.use(errorHandler);

//export app
export default app;