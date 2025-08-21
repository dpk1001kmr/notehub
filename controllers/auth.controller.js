const { User } = require("../models/user.model");
const { asyncHandler } = require("../utils/async-handler");
const { CustomError } = require("../utils/custom-error");

const register = asyncHandler(async (req, res, next) => {
  let { name, email, password } = req.body;

  const existedUser = await User.findOne({ email: email });
  if (existedUser) {
    const customError = new CustomError(409, "fail", "user already exist");
    return next(customError);
  }

  const user = await User.create({ name, email, password });
  if (!user) next();

  user.password = undefined;
  return res.status(201).json({
    status: "success",
    data: user,
    message: "user created successfully",
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const customError = new CustomError(400, "fail", "user does not exist");
    return next(customError);
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    const customError = new CustomError(
      401,
      "fail",
      "invalid user credentials"
    );
    return next(customError);
  }

  const token = user.generateToken();
  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    maxAge: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    httpOnly: true, // cannot be accessed via JS
    secure: false,
  };
  res.cookie("token", token, options);

  return res.status(200).json({
    status: "success",
    data: loggedInUser,
    message: "login successful",
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    status: "success",
    message: "logout successful",
  });
});

const me = asyncHandler(async (req, res) => {
  const user = req.user;
  return res.status(200).json({
    status: "successful",
    data: user,
    message: "data fetched successfully",
  });
});

const authController = {
  register,
  login,
  logout,
  me,
};

module.exports = { authController };
