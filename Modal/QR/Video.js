const mongoose = require("mongoose");
const VideoQrSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    QrName: {
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
    PublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const VideoModel = mongoose.model("Video", VideoQrSchema);
module.exports = VideoModel;
