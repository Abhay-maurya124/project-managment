import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
// Thunk to call the backend API
export const createDeadline = createAsyncThunk(
  "deadline/create",
  async ({ projectId, deadlineData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/deadline/create/${projectId}`,
        deadlineData,
      );
      toast.success(data.message);
      return data.data.deadline;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to create deadline";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);
const deadlineSlice = createSlice({
  name: "deadline",
  initialState: {
    deadlines: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDeadline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeadline.fulfilled, (state, action) => {
        state.loading = false;
        state.deadlines.push(action.payload);
      })
      .addCase(createDeadline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default deadlineSlice.reducer;
