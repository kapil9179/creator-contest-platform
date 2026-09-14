import User from "../models/user/user.model.js";

import createApiError from "../utils/apierror.js";
import { verifyToken } from "../utils/jwt.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw createApiError(
        401,
        "Authentication required"
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      throw createApiError(
        401,
        "User not found"
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        createApiError(
          401,
          "Invalid or expired token"
        )
      );
    }

    next(error);
  }
};

export default authenticateUser;