const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      requried: true,
    },
    ContactNumber: {
      type: Number,
      requried: true,
      unique: true,
    },
    Email: {
      type: String,
      requried: true,
    },
    Password: {
      type: String,
      requried: true,
    },
    subscription: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription",
      },
    ],
    Qr: [],
    isUser: {
      type: Boolean,
      requried: true,
      default: false,
    },
    isAdwin: {
      type: Boolean,
      requried: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      requried: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
