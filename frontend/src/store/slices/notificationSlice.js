import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch all notifications with stats
export const fetchNotifications = createAsyncThunk(
  "notification/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/notification");
      return data.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load notifications");
    }
  }
);

// Mark single as read
export const markAsRead = createAsyncThunk(
  "notification/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/notification/${id}/read`);
      return data.data.notification;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete notification
export const deleteNotificationAction = createAsyncThunk(
  "notification/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/notification/${id}/delete`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    unreadCount: 0,
    readCount: 0,
    highPriorityCount: 0,
    thisWeekCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.notification;
        state.unreadCount = action.payload.unreadOnly;
        state.readCount = action.payload.readOnly;
        state.highPriorityCount = action.payload.highPriorityMessages;
        state.thisWeekCount = action.payload.thisWeekNotifications;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.list.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.list[index].isRead = true;
          state.unreadCount -= 1;
          state.readCount += 1;
        }
      })
      .addCase(deleteNotificationAction.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          toast.error(action.payload);
        }
      );
  },
});

export default notificationSlice.reducer;