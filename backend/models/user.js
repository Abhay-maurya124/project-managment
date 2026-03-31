import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
      select: false,
      minLength: [8, "Password must be atleast of 8 charectors"],
    },
    role: {
      type: String,
      default: "student",
      enum: ["Student", "Teacher", "Admin"],
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

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.generatetoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

UserSchema.methods.comparepassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

UserSchema.methods.getresetpasswordToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetpasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
export const User = mongoose.model("User", UserSchema);
