import bcrypt from "bcryptjs";
import User from "../models/user/user.model.js";
import createApiError from "../utils/apierror.js";
import { generateToken } from "../utils/jwt.js";

const signupUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw createApiError(
      409,
      "User already exists with this email"
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken({
    userId: user._id,
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      residency: user.residency,
    },
    token,
  };
};


//  login api 

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw createApiError(
      401,
      "Invalid email or password"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw createApiError(
      401,
      "Invalid email or password"
    );
  }

  const token = generateToken({
    userId: user._id,
  });

  return {
    user: {
      id: user._id,
      email: user.email,
      residency: user.residency,
    },
    token,
  };
};

export {
  signupUser,
  loginUser,
};