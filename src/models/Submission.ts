import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
    {
        name: String,
        businessType: String,
        goals: String,
        budget: String,
        location: String,
        aiBrief: Object,
    },
    { timestamps: true }
);

export default mongoose.models.Submission ||
    mongoose.model("Submission", SubmissionSchema);