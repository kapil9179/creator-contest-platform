import { getContestDataService } from "../../services/contest/contest.service.js";
import apiResponse from "../../utils/apIresponse.js";

const getContestData = async (req, res, next) => {
  try {
    const posts = await getContestDataService();

    return apiResponse(
      res,
      200,
      "Contest data fetched successfully",
      posts
    );
  } catch (error) {
    next(error);
  }
};

export {
  getContestData,
};