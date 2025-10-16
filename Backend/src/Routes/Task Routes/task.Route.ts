import { Router } from "express";
import {
  createNewTask,
  updateSpecificTask,
  deleteSpecificTask,
  getAllTaskOfUser,
} from "../../Controllers/Task Controller/task.Controller";
import { verifyJWT } from "../../Middleware/Auth.middleware";

const taskRoute = Router();

// Legacy path remains available when mounted at /api/v1/task
taskRoute.post("/create-new-task", verifyJWT, createNewTask);

// Spec-compliant CRUD when mounted at /api/tasks
taskRoute.post("/", verifyJWT, createNewTask);
taskRoute.put("/:id", verifyJWT, updateSpecificTask);
taskRoute.delete("/:id", verifyJWT, deleteSpecificTask);
taskRoute.get("/", verifyJWT, getAllTaskOfUser);

export default taskRoute;
