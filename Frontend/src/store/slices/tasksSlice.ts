import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "Pending" | "Working..." | "Partially Completed" | "Completed";
};

type TasksState = {
  items: Task[];
  status: "idle" | "loading" | "failed";
  error?: string;
};

const initialState: TasksState = { items: [], status: "idle" };

export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/tasks");
      if (!data?.success) return rejectWithValue("Failed to fetch tasks");
      return data.data as Task[];
    } catch (e) {
      return rejectWithValue(
        //@ts-ignore
        e?.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (
    payload: { title: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/tasks",
        payload
      );
      if (!data?.success) return rejectWithValue("Failed to create task");
      return data.data as Task;
    } catch (e) {
      return rejectWithValue(
        //@ts-ignore
        e?.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async (
    payload: {
      id: string;
      update: Partial<Pick<Task, "title" | "description" | "status">>;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8080/api/tasks/${payload.id}`,
        payload.update
      );
      if (!data?.success) return rejectWithValue("Failed to update task");
      return data.data as Task;
    } catch (e) {
      return rejectWithValue(
        //@ts-ignore
        e?.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/tasks/${id}`
      );
      if (!data?.success) return rejectWithValue("Failed to delete task");
      return id;
    } catch (e) {
      return rejectWithValue(
        //@ts-ignore
        e?.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (s) => {
        s.status = "loading";
        s.error = undefined;
      })
      .addCase(fetchTasks.fulfilled, (s, a: PayloadAction<Task[]>) => {
        s.status = "idle";
        s.items = a.payload;
      })
      .addCase(fetchTasks.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as string) || "Failed to fetch tasks";
      })
      .addCase(createTask.fulfilled, (s, a: PayloadAction<Task>) => {
        s.items.unshift(a.payload);
      })
      .addCase(updateTask.fulfilled, (s, a: PayloadAction<Task>) => {
        const idx = s.items.findIndex((t) => t._id === a.payload._id);
        if (idx >= 0) s.items[idx] = a.payload;
      })
      .addCase(deleteTask.fulfilled, (s, a: PayloadAction<string>) => {
        s.items = s.items.filter((t) => t._id !== a.payload);
      });
  },
});

export default tasksSlice.reducer;
