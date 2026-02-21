import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    })
);

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