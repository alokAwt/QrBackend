const mongoose = require("mongoose");
const DocumentQrSchema = new mongoose.Schema(
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
      default: "Documents",
    },
  },
  {
    timestamps: true,
  }
);
const DocumnetModel = mongoose.model("Documnet", DocumentQrSchema);
module.exports = DocumnetModel;
