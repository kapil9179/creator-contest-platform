import {
  signupUser,
  loginUser,
} from "../services/auth.service.js";

import apiResponse from "../utils/apIresponse.js";
import createApiError from "../utils/apierror.js";

//  signup controller
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createApiError(
        400,
        "Email and password are required"
      );
    }

    const result = await signupUser({
      email,
      password,
    });

    return apiResponse(
      res,
      201,
      "User registered successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

//  login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createApiError(
        400,
        "Email and password are required"
      );
    }

    const result = await loginUser({
      email,
      password,
    });

    return apiResponse(
      res,
      200,
      "Login successful",
      result
    );
  } catch (error) {
    next(error);
  }
};

export {
  signup,
  login,
};