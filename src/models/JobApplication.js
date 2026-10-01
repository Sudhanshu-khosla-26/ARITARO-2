import mongoose, { Schema } from "mongoose";

const JobApplicationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    position: { type: String, required: true, trim: true },
    jobId: { type: Schema.Types.ObjectId, ref: "JobOpportunity" },
    portfolioUrl: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    experience: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    source: { type: String, default: "careers_page" },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "rejected", "hired"],
      default: "new",
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

JobApplicationSchema.index({ status: 1, createdAt: -1 });
JobApplicationSchema.index({ jobId: 1, status: 1 });
JobApplicationSchema.index({ deletedAt: 1, createdAt: -1 });

const JobApplication =
  mongoose.models.JobApplication || mongoose.model("JobApplication", JobApplicationSchema);

export default JobApplication;
