import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("Not authorized", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user id to request

    next();
  } catch (error) {
    next(new AppError("Not authorized", 401));
  }
};

export default protect;