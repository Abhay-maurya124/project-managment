import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
// import { createDeadline } from "./deadlineSlice";

export const createStudent = createAsyncThunk(
  "admin/create",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/createStudent", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const UpdateStudent = createAsyncThunk(
  "admin/update",
  async (data, id, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/updateStudent/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const deleteStudent = createAsyncThunk(
  "admin/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/deleteStudent/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const getAlluser = createAsyncThunk("Alluser", async (id, thunkAPI) => {
  try {
    const res = await axiosInstance.delete(`/admin/allUser`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    toast.success(res.data.message);
    return res.data.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const createTeacher = createAsyncThunk(
  "admin/create",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/createTeacher", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const UpdateTeacher = createAsyncThunk(
  "admin/update",
  async (data, id, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/updateTeacher/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const deleteTeacher = createAsyncThunk(
  "admin/delete",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/deleteTeacher/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    students: [],
    teachers: [],
    projects: [],
    users: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.fulfilled, (state, action) => {
        if (state.users) state.users.unshift(action.payload);
      })
      .addCase(UpdateStudent.fulfilled, (state) => {
        if (state.users) {
          state.users = state.users.map((u) => u._id)
            ? { ...u, ...action.payload }
            : u;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.filter((u) => u.id !== action.payload);
        }
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        if (state.users) state.users.unshift(action.payload);
      })
      .addCase(UpdateTeacher.fulfilled, (state) => {
        if (state.users) {
          state.users = state.users.map((u) => u._id)
            ? { ...u, ...action.payload }
            : u;
        }
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        if (state.users) {
          state.users = state.users.filter((u) => u.id !== action.payload);
        }
      })
      .addCase(getAlluser.fulfilled, (state, action) => {
        state.users = action.payload.users;
      });
  },
});

export default adminSlice.reducer;
