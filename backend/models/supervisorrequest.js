import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "student is required"],
    },
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "superVisor is required"],
    },
    message: {
      type: Date,
      trim: true,
      required: [true, "Message is required"],
      maxlength: [250, "Message cannot exceed 250 charector"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
  },
  {
    timestamps: true,
  },
);
// indexing for project setting

supervisorSchema.index({ student: 1 });
supervisorSchema.index({ supervisor: 1 });
supervisorSchema.index({ status: 1 });

export const supervisor =
  mongoose.models.supervisor || mongoose.model("supervisor", supervisorSchema);
