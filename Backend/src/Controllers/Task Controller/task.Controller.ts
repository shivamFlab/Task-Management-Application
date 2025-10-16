import { Request, Response } from "express";
import { Task } from "../../Modals/Task Modal/task.Modal";

const createNewTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title is a required field and must be a non-empty string.",
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      // @ts-expect-error user augmented by middleware
      user: req?.user,
    });

    if (!newTask) {
      return res.status(500).json({
        success: false,
        message: "Unable to create new task. Please try again later.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully!",
      data: newTask,
    });
  } catch (error: any) {
    console.error("Error while creating new task:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating new task.",
    });
  }
};

const updateSpecificTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required to update the task.",
      });
    }

    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim().length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "If provided, title must be a non-empty string.",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim?.() ?? "" }),
        ...(status && { status: status }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found. Unable to update.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully!",
      data: updatedTask,
    });
  } catch (error: any) {
    console.error("Error while creating new task:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating new task.",
    });
  }
};

const deleteSpecificTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required to delete the task.",
      });
    }

    const updatedTask = await Task.findByIdAndDelete(id);

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found. Unable to delete.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully!",
    });
  } catch (error: any) {
    console.error("Error while deleting task", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting task.",
    });
  }
};

const getAllTaskOfUser = async (req: Request, res: Response) => {
  // @ts-expect-error user augmented by middleware
  const allTask = await Task.find({ user: req?.user });

  if (!allTask) {
    return res.json({
      success: true,
      message: "No task found!",
      data: [],
    });
  }

  return res.json({
    success: true,
    message: "All task fetched successfully!",
    data: allTask,
  });
};

export {
  createNewTask,
  updateSpecificTask,
  deleteSpecificTask,
  getAllTaskOfUser,
};
