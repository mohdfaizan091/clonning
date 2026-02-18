import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  User from "../user/user.model.js"
import AppError from "../utils/AppError.js";


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
    { expiresIn: "1h" }
  );

  return { user, token };
};



