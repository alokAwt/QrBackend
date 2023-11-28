const mongoose = require("mongoose");
const AudioQrSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    ScanId: {
      type: [],
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
  },
  {
    timestamps: true,
  }
);
const AudioModel = mongoose.model("Audio", AudioQrSchema);
module.exports = AudioModel;
