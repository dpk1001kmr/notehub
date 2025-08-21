const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../utils/async-handler");
const { CustomError } = require("../utils/custom-error");
const { User } = require("../models/user.model");

const verifyJWTToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    const customError = new CustomError(401, "fail", "unauthorized request");
    return next(customError);
  }
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id).select("-password");

  if (!user) {
    const customError = new CustomError(401, "fail", "invalid access token");
    return next(customError);
  }
  req.user = user;
  next();
});

module.exports = { verifyJWTToken };
