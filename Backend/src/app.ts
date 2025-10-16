import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/User Routes/user.route";
import taskRoute from "./Routes/Task Routes/task.Route";
const app = express();

dotenv.config({
  path: "./.env",
});

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("Public"));

app.use(cookieParser());

app.get("/", (req, res) => {
  console.log("we are here");
  return res.json({
    data: [],
    message: "Task management server is up and runnning...",
  });
});

// Legacy routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRoute);

// Standardized routes per spec
app.use("/api/auth", userRouter);
app.use("/api/tasks", taskRoute);

export { app };
