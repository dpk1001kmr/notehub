const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");

const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

const cookieParser = require("cookie-parser");

const path = require("path");
const swaggerUi = require("swagger-ui-express");
const SwaggerParser = require("@apidevtools/swagger-parser");
const { authRouter } = require("./routes/auth.route");
const { noteRouter } = require("./routes/note.route");
const { CustomError } = require("./utils/custom-error");
const { notFound } = require("./middleware/not-found");
const { globalErrorHandler } = require("./middleware/error-handler");

const app = express();

(async () => {
  // Swagger setting
  const swaggerPath = path.join(__dirname, "swagger", "swagger.yaml");
  const apiDocs = await SwaggerParser.bundle(swaggerPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

  // App middleware
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  // app.use(express.static("public"));
  app.use(cookieParser());

  // Security middlewares
  app.set("trust proxy", 1);
  app.use(
    rateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 15, // limit each IP to 100 requests per windowMs
    })
  );
  app.use(helmet());
  // app.use(cors());
  app.use(xss());

  // App routes

  // app.use("/", (req, res) => {
  //   return res.send(
  //     '<a href="/api-docs" style="font-style: sans-serif">Go to API Documentation</a>'
  //   );
  // });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/note", noteRouter);

  // Route not found handler
  app.all("*", notFound);
  // Global error handler middleware
  app.use(globalErrorHandler);

  await mongoose.connect(process.env.MONGO_URI);
  console.log("CONNECTED TO DATABASE");
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log("Server running on port 8000"));
})();
