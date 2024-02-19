const mongoose = require("mongoose");
const AudioQrSchema = new mongoose.Schema(
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
      default: "Audio",
    },
  },
  {
    timestamps: true,
  }
);
const AudioModel = mongoose.model("Audio", AudioQrSchema);
module.exports = AudioModel;
