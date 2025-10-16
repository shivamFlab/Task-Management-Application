import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: false, default: "No description" },
    status: {
      type: String,
      enum: ["Pending", "Working...", "Partially Completed", "Completed"],
      default: "Pending",
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
