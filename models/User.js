import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true }, // Date of Birth
    class: { type: Number, required: true, enum: [11, 12] }, // Only 11 or 12 allowed
    exam: { type: String, required: true, enum: ["JEE", "NEET", "UPSC"] }, // Only these exams allowed

    // ✅ Track completed modules
    completedChapters: { type: [String], default: [] }, // Array of completed chapter names
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
