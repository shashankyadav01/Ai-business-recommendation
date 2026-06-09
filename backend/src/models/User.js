import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    membershipType: {
      type: String,
      enum: ["annual", "partner", null],
      default: null,
    },
    // Annual Member Fields
    fullName: String,
    email: String,
    company: String,
    position: String,
    industry: String,
    businessCategory: String,
    
    // Partner Member Fields
    partnerName: String,
    partnerEmail: String,
    partnerCompany: String,
    partnerServiceType: String,
    partnerIndustry: String,
    partnerExperience: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "User",
  userSchema
);