import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    services: [String],
    email: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    industry: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model(
  "Company",
  companySchema
);

export default Company;