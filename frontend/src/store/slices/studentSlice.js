import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
// 1. Fetch Student Project
export const getStudentProject = createAsyncThunk(
  "student/getProject",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/student/project");
      return data.data.project;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// 2. Submit Project Proposal
export const submitProposal = createAsyncThunk(
  "student/submitProposal",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/student/proposal", formData);
      toast.success(data.message);
      return data.data.Project;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// 3. Upload Project Files
export const uploadProjectFiles = createAsyncThunk(
  "student/uploadFiles",
  async ({ projectId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/student/upload/${projectId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Files uploaded successfully");
      return data.data.project;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// 4. Fetch Available Supervisors
export const fetchSupervisors = createAsyncThunk(
  "student/fetchSupervisors",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/student/fetch-Supervisor");
      return data.data.supervisors;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// 5. Request a Supervisor
export const sendSupervisorRequest = createAsyncThunk(
  "student/requestSupervisor",
  async (requestData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/student/request-supervisor", requestData);
      toast.success("Request sent successfully!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// 6. Get Feedback (Specific Project)
export const getProjectFeedback = createAsyncThunk(
  "student/getFeedback",
  async (projectId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/student/feedback/${projectId}`);
      return data.data.feedback;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// 7. Get Dashboard Stats (Dynamic Data)
export const getDashboardStats = createAsyncThunk(
  "student/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/student/getDashboardStats");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);
// const studentSlice = createSlice({
//   name: "student",
//   initialState: {
//     project: null,
//     supervisors: [],
//     stats: {
//       upcomingDeadlines: [],
//       notifications: [],
//     },
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearStudentErrors: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//      
//       .addCase(getStudentProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.project = action.payload;
//       })
//       .addCase(submitProposal.fulfilled, (state, action) => {
//         state.loading = false;
//         state.project = action.payload;
//       })
//       .addCase(uploadProjectFiles.fulfilled, (state, action) => {
//         state.loading = false;
//         state.project = action.payload;
//       })
//       .addCase(fetchSupervisors.fulfilled, (state, action) => {
//         state.loading = false;
//         state.supervisors = action.payload;
//       })
//       .addCase(getDashboardStats.fulfilled, (state, action) => {
//         state.loading = false;
//         state.project = action.payload.project;
//         state.stats.upcomingDeadlines = action.payload.upcomingDeadline;
//         state.stats.notifications = action.payload.topNotification;
//       })
//      
//       .addMatcher(
//         (action) => action.type.endsWith("/pending"),
//         (state) => {
//           state.loading = true;
//           state.error = null;
//         }
//       )
//       .addMatcher(
//         (action) => action.type.endsWith("/rejected"),
//         (state, action) => {
//           state.loading = false;
//           state.error = action.payload;
//         }
//       );
//   },
// });
const studentSlice = createSlice({
  name: "student",
  initialState: {
    project: null,
    supervisors: [],
    stats: {
      upcomingDeadlines: [],
      notifications: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearStudentErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStudentProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(submitProposal.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(uploadProjectFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(fetchSupervisors.fulfilled, (state, action) => {
        state.loading = false;
        state.supervisors = action.payload;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload.project;
        state.stats.upcomingDeadlines = action.payload.upcomingDeadline;
        state.stats.notifications = action.payload.topNotification;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});
export const { clearStudentErrors } = studentSlice.actions;
export default studentSlice.reducer;