const mongoose = require("mongoose");
const ImageQrSchema = new mongoose.Schema(
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
      default: "Images",
    },
  },
  {
    timestamps: true,
  }
);
const ImageModel = mongoose.model("Image", ImageQrSchema);
module.exports = ImageModel;
