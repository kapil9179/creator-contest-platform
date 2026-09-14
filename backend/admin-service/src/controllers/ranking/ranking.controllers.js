import { getRankings } from "../../services/ranking/ranking.service.js";
import apiResponse from "../../utils/apiresponse.js";

const fetchRankings = async (
  req,
  res,
  next
) => {
  try {
    const rankings = await getRankings();

    return apiResponse(
      res,
      200,
      "Rankings fetched successfully",
      rankings
    );
  } catch (error) {
    next(error);
  }
};

export {
  fetchRankings,
};