const createApiError = (
  statusCode = 500,
  message = "Something went wrong",
  errors = []
) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.errors = errors;

  return error;
};

export default createApiError;