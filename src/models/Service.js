import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  bannerImage: { type: String },
  pricing: { type: String },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
