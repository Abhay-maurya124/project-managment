import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
export const fetchAllProjects = createAsyncThunk(
  "project/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/project");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch projects");
    }
  }
);
const projectSlice = createSlice({
  name: "project",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
      })
.addCase(fetchAllProjects.fulfilled, (state, action) => {
  state.loading = false;
  state.projects = action.payload.data?.projects || []; 
})
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});
export default projectSlice.reducer;