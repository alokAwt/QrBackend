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
    Qr: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Audio",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Documnet",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Map",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlayStore",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialMediaQr",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "websiteQr",
      },
    ],
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
    strictPopulate: false,
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
