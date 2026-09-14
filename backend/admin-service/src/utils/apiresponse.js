const apiResponse = (
  res,
  statusCode = 200,
  message = "Success",
  data = null
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};

export default apiResponse;