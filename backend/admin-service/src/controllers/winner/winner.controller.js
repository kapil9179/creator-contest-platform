

import { generateWinnersService, getWinnersService } from "../../services/winners/winners.service.js";

import apiResponse from "../../utils/apiresponse.js";
const generateWinners = async (
    req,
    res,
    next
) => {
    try {
        const winners =
            await generateWinnersService();

        return apiResponse(
            res,
            201,
            "Winners generated successfully",
            winners
        );
    } catch (error) {
        next(error);
    }
};

const getWinners = async (
    req,
    res,
    next
) => {
    try {
        const winners =
            await getWinnersService();

        return apiResponse(
            res,
            200,
            "Winners fetched successfully",
            winners
        );
    } catch (error) {
        next(error);
    }
};

export {
    generateWinners,
    getWinners,
};