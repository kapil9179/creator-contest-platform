import {
  requestKycService,
  passKycService,
  failKycService,
} from "../../services/kyc/kyc.service.js";

import apiResponse from "../../utils/apiresponse.js";
const requestKyc = async (req, res, next) => {
  try {
    const winner = await requestKycService(
      req.params.winnerId
    );

    return apiResponse(
      res,
      200,
      "KYC requested successfully",
      winner
    );
  } catch (error) {
    next(error);
  }
};

const passKyc = async (req, res, next) => {
  try {
    const winner = await passKycService(
      req.params.winnerId
    );

    return apiResponse(
      res,
      200,
      "KYC passed successfully",
      winner
    );
  } catch (error) {
    next(error);
  }
};

const failKyc = async (req, res, next) => {
  try {
    const result = await failKycService(
      req.params.winnerId
    );

    return apiResponse(
      res,
      200,
      result.slotUnawarded
        ? "KYC failed. No eligible replacement found"
        : "KYC failed and prize cascaded successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

export {
  requestKyc,
  passKyc,
  failKyc,
};