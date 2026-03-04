import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  User from "../user/user.model.js"
import AppError from "../utils/AppError.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";


export const registerUser = async ({ username, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  return user;
};

//login user
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  // Generic error (prevent enumeration)
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { user, accessToken: token, refreshToken };
};


export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // User na mile toh bhi success return karo — enumeration prevent
  if (!user) return;

  // Secure random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash karke DB mein save karo
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

  await user.save();

  // Email bhejo
  await sendPasswordResetEmail(email, resetToken);
};

export const resetPassword = async (token, newPassword) => {
  // Token hash karo aur DB se match karo
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }, // expired nahi hona chahiye
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  // Naya password set karo
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
};


