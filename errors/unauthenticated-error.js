const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;
