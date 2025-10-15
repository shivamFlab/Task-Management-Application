import { Router } from "express";
import {
  createNewTask,
  updateSpecificTask,
  deleteSpecificTask,
  getAllTaskOfUser,
} from "../../Controllers/Task Controller/task.Controller";
import { verifyJWT } from "../../Middleware/Auth.middleware";

const taskRoute = Router();

taskRoute.post("/create-new-task", verifyJWT, createNewTask);
taskRoute.put("/:id", verifyJWT, updateSpecificTask);
taskRoute.delete("/:id", verifyJWT, deleteSpecificTask);
taskRoute.get("/", verifyJWT, getAllTaskOfUser);

export default taskRoute;
