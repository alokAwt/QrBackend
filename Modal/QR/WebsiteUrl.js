const mongoose = require("mongoose");
const WebsiteQrSchema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    QrName:{
      type: String,
      required: true,
    },
    QrImage: {
      type: String,
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
      default: "Website",
    },
  },
  {
    timestamps: true,
  }
);
const WebsiteModel = mongoose.model("websiteQr", WebsiteQrSchema);
module.exports = WebsiteModel;
