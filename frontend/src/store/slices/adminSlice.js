import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
// --- STUDENT ACTIONS ---
export const createStudent = createAsyncThunk(
  "admin/createStudent",
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
  },
);
export const UpdateStudent = createAsyncThunk(
  "admin/updateStudent",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/updateStudent/${id}`, data);
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
  "admin/deleteStudent",
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
  },
);
// --- TEACHER ACTIONS ---
export const createTeacher = createAsyncThunk(
  "admin/createTeacher",
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
  },
);
export const UpdateTeacher = createAsyncThunk(
  "admin/updateTeacher",
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
  },
);
export const deleteTeacher = createAsyncThunk(
  "admin/deleteTeacher",
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
  },
);
export const getAlluser = createAsyncThunk(
  "admin/getAlluser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/admin/allUser`);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const assignSupervisorAction = createAsyncThunk(
  "admin/assignSupervisor",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/admin/assign-supervisor", data);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Assignment failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const updateProjectStatusAction = createAsyncThunk(
  "admin/updateProjectStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/project-status/${id}`, {
        status,
      });
      toast.success(res.data.message);
      return { id, status };
    } catch (error) {
      const message = error.response?.data?.message || "Status update failed";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);
export const getAllProjects = createAsyncThunk(
  "admin/getAllProjects",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/admin/all-projects");
      return res.data.projects;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
export const approveProjectAction = createAsyncThunk(
  "admin/approveProject",
  async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/admin/approve-project/${id}`);
      return res.data.project;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  },
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    Alluser: [],
    allProjects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(getAlluser.fulfilled, (state, action) => {
        state.loading = false;
        state.Alluser = action.payload.Alluser || [];
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.allProjects = action.payload || [];
      })
      .addCase(approveProjectAction.fulfilled, (state, action) => {
        const index = state.allProjects.findIndex(
          (p) => p._id === action.payload._id,
        );
        if (index !== -1) {
          state.allProjects[index] = action.payload;
        }
        toast.success("Project Approved!");
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/createStudent/fulfilled") ||
          action.type.endsWith("/createTeacher/fulfilled"),
        (state, action) => {
          state.Alluser.unshift(action.payload);
        },
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/updateStudent/fulfilled") ||
          action.type.endsWith("/updateTeacher/fulfilled"),
        (state, action) => {
          state.Alluser = state.Alluser.map((u) =>
            u._id === action.payload._id ? action.payload : u,
          );
        },
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/deleteStudent/fulfilled") ||
          action.type.endsWith("/deleteTeacher/fulfilled"),
        (state, action) => {
          state.Alluser = state.Alluser.filter((u) => u._id !== action.payload);
        },
      );
  },
});
export default adminSlice.reducer;
