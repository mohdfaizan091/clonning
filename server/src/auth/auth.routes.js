import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { register, login, getMe } from "./auth.controller.js";

const router = express.Router();
router.get("/me", protect, getMe);

router.post("/register", register);
router.post("/login", login);


export default router;