import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// --- STUDENT ACTIONS ---
export const createStudent = createAsyncThunk(
  "admin/createStudent", // Unique Type
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/createStudent", data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UpdateStudent = createAsyncThunk(
  "admin/updateStudent", // Unique Type
  async ({ id, data }, thunkAPI) => { // id and data must be passed as one object
    try {
      const res = await axiosInstance.put(`/admin/updateStudent/${id}`, data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "admin/deleteStudent", // Unique Type
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/deleteStudent/${id}`);
      toast.success(res.data.message);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- TEACHER ACTIONS ---
export const createTeacher = createAsyncThunk(
  "admin/createTeacher", // Unique Type
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/createTeacher", data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UpdateTeacher = createAsyncThunk(
  "admin/updateTeacher", // Unique Type
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/updateTeacher/${id}`, data);
      toast.success(res.data.message);
      return res.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "admin/deleteTeacher", // Unique Type
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/admin/deleteTeacher/${id}`);
      toast.success(res.data.message);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAlluser = createAsyncThunk(
  "admin/getAlluser", 
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/admin/allUser`); // Changed from .delete to .get
      return res.data; 
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET USERS
      .addCase(getAlluser.fulfilled, (state, action) => {
        state.users = action.payload.users || action.payload;
      })
      // CREATE
      .addMatcher(
        (action) => action.type.endsWith('/createStudent/fulfilled') || action.type.endsWith('/createTeacher/fulfilled'),
        (state, action) => {
          state.users.unshift(action.payload);
        }
      )
      // UPDATE
      .addMatcher(
        (action) => action.type.endsWith('/updateStudent/fulfilled') || action.type.endsWith('/updateTeacher/fulfilled'),
        (state, action) => {
          state.users = state.users.map((u) => 
            u._id === action.payload._id ? action.payload : u
          );
        }
      )
      // DELETE
      .addMatcher(
        (action) => action.type.endsWith('/deleteStudent/fulfilled') || action.type.endsWith('/deleteTeacher/fulfilled'),
        (state, action) => {
          state.users = state.users.filter((u) => u._id !== action.payload);
        }
      );
  },
});

export default adminSlice.reducer;