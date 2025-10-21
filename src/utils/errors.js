export const TryError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const CatchError = (err, res, productionMessage = "Internal server error") => {
  const message =
    process.env.NODE_ENV === "dev" ? err.message : productionMessage;

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    status,
    message,
  });
};