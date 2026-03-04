import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { body, validationResult } from "express-validator";
import { create, getAll, getOne, update, remove,stats } from "./application.controller.js";

const router = express.Router();

// Sab routes protected hain
router.use(protect);

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

const applicationValidation = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name too long"),
  body("jobTitle")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ max: 100 })
    .withMessage("Job title too long"),
  body("status")
    .optional()
    .isIn(["Applied", "Screening", "Interview", "Offer", "Rejected"])
    .withMessage("Invalid status"),
  body("salaryRange")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Salary range too long"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes too long"),
];

router.get("/", getAll);
router.get("/stats", stats);
router.get("/:id", getOne);
router.post("/", applicationValidation, handleValidation, create);
router.put("/:id", applicationValidation, handleValidation, update);
router.delete("/:id", remove);


export default router;