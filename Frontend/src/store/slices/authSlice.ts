import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axios";
import axios from "axios";

type User = {
  _id: string;
  username: string;
  loginEmail: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  status: "idle" | "loading" | "failed";
  error?: string;
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: null,
  status: "idle",
};

// ✅ LOGIN
export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(
      "http://localhost:8080/api/auth/login",
      payload
    );
    if (!data?.success) return rejectWithValue(data?.message || "Login failed");
    return data as { token: string; user: User };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
    return rejectWithValue("Unexpected error occurred during login");
  }
});

// ✅ REGISTER
export const register = createAsyncThunk<
  true,
  { username: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("http://localhost:8080/api/auth/register", payload);
    if (!data?.success)
      return rejectWithValue(data?.message || "Register failed");
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Register failed"
      );
    }
    return rejectWithValue("Unexpected error occurred during registration");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (action.payload) localStorage.setItem("token", action.payload);
      else localStorage.removeItem("token");
    },
    // ✅ Add clearError reducer
    clearError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      // ✅ Keep error visible — don’t clear on pending
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = undefined;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "Login failed";
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "idle";
        state.error = undefined;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error.message ?? "Register failed";
      });
  },
});

export const { logout, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
