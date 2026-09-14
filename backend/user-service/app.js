import express from "express";
import cors from "cors";
import path from "path";
import connectUserDB from "./src/configs/db/db.config.js";
import envconfig from "./src/configs/env/env.config.js";
import globalErrorHandler from "./src/middlewares/error.middleware.js";
import notFoundHandler from "./src/middlewares/notfound.middleware.js";
import authRoutes from './src/routes/auth.routes.js'
import userRoutes from './src/routes/user.routes.js'
import postRoutes from './src/routes/post/post.routes.js'
import internalContestRoutes from './src/routes/contest/contest.routes.js'

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User Service is running",
  });
});

// serve static files
app.use("/uploads",express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/internal/contest",internalContestRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectUserDB();

    app.listen(envconfig.port, () => {
      console.log(`Server running on port ${envconfig.port}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;



