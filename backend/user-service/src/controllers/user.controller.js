import apiResponse from "../utils/apIresponse.js";
import createApiError from "../utils/apierror.js";
import { updateResidencyService } from "../services/user.service.js";

const updateResidency = async (req, res, next) => {
  try {
    const { residency } = req.body;

    if (!residency || !residency.trim()) {
      throw createApiError(
        400,
        "Residency is required"
      );
    }

    const user = await updateResidencyService(
      req.user._id,
      residency
    );

    return apiResponse(
      res,
      200,
      "Residency updated successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};

export {
  updateResidency,
};