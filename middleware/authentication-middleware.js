const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Unauthorized user");
  }

  const token = authHeader.split(" ")[1];

  const decode = jwt.decode(token, process.env.JWT_SECRET);

  req.user = {
    user_id: decode.user_id,
    user_name: decode.user_name,
    user_surname: decode.user_surname,
    user_gender: decode.user_gender,
    user_mail: decode.user_mail,
  };

  next();
};

module.exports = authenticationMiddleware;
