import mongoose, { Mongoose, Schema } from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is requires"],
      trim: true,
      maxLength: [50, "Name cannot be exceed maxlength of 50"],
    },
    email: {
      type: String,
      required: [true, "Email is requires"],
      unique: true,
      lowercase: true,
      maxLength: [50, "Email cannot be exceed maxlength of 50"],
    },
    password: {
      type: String,
      required: [true, "Password is requires"],
      minLength: [8, "Password must be atleast of 8 charectors"],
    },
    role: {
      type: String,
      default: "student",
      enum: ["student", "Teacher", "Admin"],
    },
    resetpasswordToken: String,
    resetPasswordExpires: Date,

    department: {
      type: String,
      trim: true,
      default: null,
    },
    experties: {
      type: [String],
      default: [],
    },
    maxStudents: {
      type: String,
      min: [1, "max students must be at least 1"],
      default: 10,
    },
    assigendStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    superVisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    projects: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("user", UserSchema);
