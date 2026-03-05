import Application from "./application.model.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";
import redis from "../utils/redis.js";

// Create
export const createApplication = async (userId, data) => {
  const application = await Application.create({
    user: userId,
    ...data,
  });

  try {
    await redis.del(`stats:${userId}`);
  } catch {
    logger.warn("Redis unavailable — cache not invalidated");
  }
  
  return application;
};

// Get all — pagination + search + filter
export const getApplications = async (userId, query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "",
  } = query;

  const filter = { user: userId };

  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { jobTitle: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

// Get one
export const getApplicationById = async (userId, applicationId) => {
  const application = await Application.findOne({
    _id: applicationId,
    user: userId,
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  return application;
};

// Update
export const updateApplication = async (userId, applicationId, data) => {
  const application = await Application.findOneAndUpdate(
    { _id: applicationId, user: userId },
    data,
    { new: true, runValidators: true }
  );

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  try {
    await redis.del(`stats:${userId}`);
  } catch {
    logger.warn("Redis unavailable — cache not invalidated");
  }

  return application;
};

// Delete
export const deleteApplication = async (userId, applicationId) => {
  const application = await Application.findOneAndDelete({
    _id: applicationId,
    user: userId,
  });

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  try {
    await redis.del(`stats:${userId}`);
  } catch {
    logger.warn("Redis unavailable — cache not invalidated");
  }
  
  return application;
};

export const getStats = async (userId) => {
  const cacheKey = `stats:${userId}`;

  // Cache check karo pehle
  try {
    const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
  } catch {
      logger.warn("Redis unavailable — falling back to MongoDB");   
  }
  

  // Cache miss — MongoDB se fetch karo
  const stats = await Application.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    Applied: 0,
    Screening: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  stats.forEach((s) => {
    result[s._id] = s.count;
    result.total += s.count;
  });

  // Cache mein save karo — 5 minutes ke liye
  try {
    await redis.set(cacheKey, JSON.stringify(result), "EX", 300);
  } catch {
    logger.warn("Redis unavailable — could not cache stats");
  }

  return result;
};