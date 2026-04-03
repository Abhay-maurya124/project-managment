import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/loginUser", data, {
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
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/logout");
    toast.success(res.data.message);
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const resetpassword = createAsyncThunk(
  "auth/resetpassword",
  async (email, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/resetpassword", { email }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const forgetpassword = createAsyncThunk(
  "auth/forgetpassword",
  async ({ token, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/user/forgetpassword/${token}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.authUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
        state.authUser = null;
      })

      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.authUser = null;
      })

      // Forget Password cases
      .addCase(forgetpassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(forgetpassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(forgetpassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })

      // Reset Password cases
      .addCase(resetpassword.pending, (state) => {
        state.isRequestingForToken = true;
      })
      .addCase(resetpassword.fulfilled, (state) => {
        state.isRequestingForToken = false;
      })
      .addCase(resetpassword.rejected, (state) => {
        state.isRequestingForToken = false;
      });
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;