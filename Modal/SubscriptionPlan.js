const mongoose = require("mongoose");

const SubscriptionPlanSchema = new mongoose.Schema(
  {
    PlanType: {
      type: String,
      required: true,
      enum: ["Basic", "Standared", "Pro"],
    },
    Price: {
      type: Number,
      required: true,
    },
    Duration: {
      type: Number,
      required: true,
    },
    Discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubcriptionPlanModel = mongoose.model("Plan", SubscriptionPlanSchema);
module.exports = SubcriptionPlanModel;
