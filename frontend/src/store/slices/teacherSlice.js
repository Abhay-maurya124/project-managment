import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Final Route: /teacher/getDashboardStats
export const getTeacherStats = createAsyncThunk(
  "teacher/getStats",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/teacher/getDashboardStats");
      // Based on your controller response: res.data.data.dashboardStats
      return res.data.data.dashboardStats;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch stats";
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
      recentNotification: [] // Controller should return array, see fix below
    },
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
        state.error = null;
      })
      .addCase(getTeacherStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherSlice.reducer;