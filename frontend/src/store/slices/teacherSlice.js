import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
// 1. Fetch Dashboard Stats
export const getTeacherStats = createAsyncThunk(
  "teacher/getStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/getDashboardStats");
      return res.data.data.dashboardStats;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch stats";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// 2. Fetch All Supervisor Requests for this Teacher
export const getSupervisorRequests = createAsyncThunk(
  "teacher/getRequests",
  async (supervisorId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/teacher/requests?supervisor=${supervisorId}`);
      return res.data.data.requests;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch requests";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// 3. Accept a Student Request
export const acceptStudentRequest = createAsyncThunk(
  "teacher/acceptRequest",
  async (requestId, thunkAPI) => {
    try {
      await axiosInstance.put(`/teacher/request/${requestId}/accept`);
      toast.success("Request accepted successfully");
      return requestId; 
    } catch (error) {
      const message = error.response?.data?.message || "Failed to accept request";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// 4. Reject a Student Request
export const rejectStudentRequest = createAsyncThunk(
  "teacher/rejectRequest",
  async (requestId, thunkAPI) => {
    try {
      await axiosInstance.put(`/teacher/request/${requestId}/reject`);
      toast.info("Request rejected");
      return requestId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to reject request";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// 5. Fetch assigned students
export const getAssignedStudentsData = createAsyncThunk(
  "teacher/getAssignedStudents",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/assigned-students");
      return res.data.data.assignedStudents;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch assigned students";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// 6. Fetch teacher files
export const getTeacherFilesData = createAsyncThunk(
  "teacher/getTeacherFiles",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/files");
      return res.data.data.files;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch teacher files";
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
const teacherSlice = createSlice({
  name: "teacher",
  initialState: {
    dashboardStats: {
      totalPendingRequests: 0,
      completedProjects: 0,
      recentNotification: [],
    },
    requests: [],
    assignedStudents: [],
    teacherFiles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(getSupervisorRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(acceptStudentRequest.fulfilled, (state, action) => {
        const reqIndex = state.requests.findIndex(req => req._id === action.payload);
        if (reqIndex !== -1) {
          state.requests[reqIndex].status = "accepted";
        }
        state.dashboardStats.totalPendingRequests -= 1;
      })
      .addCase(rejectStudentRequest.fulfilled, (state, action) => {
        const reqIndex = state.requests.findIndex(req => req._id === action.payload);
        if (reqIndex !== -1) {
          state.requests[reqIndex].status = "rejected";
        }
        state.dashboardStats.totalPendingRequests -= 1;
      })
      .addCase(getAssignedStudentsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAssignedStudentsData.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedStudents = action.payload;
      })
      .addCase(getTeacherFilesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTeacherFilesData.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherFiles = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
export default teacherSlice.reducer;