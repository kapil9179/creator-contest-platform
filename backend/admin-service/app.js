import express from "express";
import cors from "cors";
import connectAdminDB from "./src/configs/db/db.config.js";
import envconfig from "./src/configs/env/env.config.js";
import globalErrorHandler from "./src/middlewares/error.middleware.js";
import notFoundHandler from "./src/middlewares/notfound.middleware.js";
import rankingRoutes from './src/routes/ranking/ranking.routes.js'
import winnerRoutes from './src/routes/winner/winner.routes.js'
import kycRoutes from './src/routes/kyc/kyc.routes.js'

// routes
// import rankingRoutes from "./src/routes/ranking/ranking.routes.js";
// import winnerRoutes from "./src/routes/winner/winner.routes.js";
// import kycRoutes from "./src/routes/kyc/kyc.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin Service is running",
  });
});

// routes
app.use("/api/rankings", rankingRoutes);
app.use("/api/winners", winnerRoutes);
app.use("/api/kyc", kycRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectAdminDB();

    app.listen(envconfig.port, () => {
      console.log(
        `Admin Service running on port ${envconfig.port}`
      );
    });
  } catch (error) {
    console.error(
      "Application startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

export default app;