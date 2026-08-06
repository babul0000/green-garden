import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true }, // rooftop, vertical, etc.
  images: [{ type: String }],
  beforeAfter: {
    before: { type: String },
    after: { type: String }
  },
  location: { type: String },
  cost: { type: Number },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
