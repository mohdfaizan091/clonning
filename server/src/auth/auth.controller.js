import { registerUser, loginUser, forgotPassword, resetPassword } from "./auth.services.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";


 const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    await registerUser({ username, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser({ email, password });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new AppError("Not authorized", 401);
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Naya access token banao
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    next(new AppError("Not authorized", 401));
  }
};


const getMe = async (req, res, next) => {
  try {
     
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });

  } catch (error) {
    next(error);
  }
};

const forgotPasswordHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await forgotPassword(email);

    // Hamesha success return karo — user enumeration prevent
    res.status(200).json({
      success: true,
      message: "If this email exists, a reset link has been sent",
    });
  } catch (error) {
    next(error);
  }
};


const resetPasswordHandler = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    await resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

export { register, login,refresh, getMe, logout, forgotPasswordHandler, resetPasswordHandler};
