const express = require("express");
const { authController } = require("../controllers/auth.controller");
const { verifyJWTToken } = require("../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
// Protected route
authRouter.get("/me", verifyJWTToken, authController.me);

module.exports = { authRouter };
