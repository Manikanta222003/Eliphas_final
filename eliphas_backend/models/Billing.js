import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({

  clientName: { type: String, default: "" },
  companyName: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  vehicleNumber: { type: String, default: "" },
  challanNumber: { type: String, default: "" },

  // ✅ Automatic date capture
  date: {
    type: Date,
    default: Date.now
  },

  time: {
    type: String,
    default: () => {
      return new Date().toLocaleTimeString();
    }
  },

  loadType: { type: String, default: "" },
  fromLocation: { type: String, default: "" },
  toLocation: { type: String, default: "" },
  weight: { type: String, default: "" },
  billingType: { type: String, default: "" },
  billingBasis: { type: String, default: "" },
  companyFare: { type: String, default: "" },
  clientFare: { type: String, default: "" },
  dieselQuantity: { type: String, default: "" },
  dieselPrice: { type: String, default: "" },
  companyLocation: { type: String, default: "" },
  createdBy: { type: String, default: "" },
  role: { type: String, default: "" }

}, {
  timestamps: true
});

export default mongoose.model("Billing", billingSchema);