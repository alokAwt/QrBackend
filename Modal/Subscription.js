const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    planType: [],
    Price: {
      type: Number,
      required: true,
    },
    TransitionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    lastDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubcriptionModel = mongoose.model("Subscription", SubscriptionSchema);
module.exports = SubcriptionModel;
