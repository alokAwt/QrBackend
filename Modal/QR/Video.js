const mongoose = require("mongoose");
const VideoQrSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    QrImage: {
      type: String,
      required: true,
    },
    Url: {
      type: String,
      required: true,
    },
    UniqueId: {
      type: Number,
      required: true,
      unique: true,
    },
    Qrtype: {
      type: String,
      default: "Video",
    },
  },
  {
    timestamps: true,
  }
);
const VideoModel = mongoose.model("Video", VideoQrSchema);
module.exports = VideoModel;
