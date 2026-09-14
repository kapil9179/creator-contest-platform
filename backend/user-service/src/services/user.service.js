
import User from "../models/user/user.model.js";
import createApiError from "../utils/apierror.js";

const updateResidencyService = async (userId, residency) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      residency: residency.trim(),
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw createApiError(
      404,
      "User not found"
    );
  }

  return user;
};

export {
  updateResidencyService,
};