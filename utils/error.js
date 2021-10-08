class AppError extends Error {
  constructor(errorCode, message) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.status = errorCode.toString().startsWith("4")
      ? "Fail"
      : "Something went wrong!";
  }
}

module.exports = AppError;
