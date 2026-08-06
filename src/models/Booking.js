import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  size: { type: Number },
  budgetTier: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "completed"], default: "pending" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
