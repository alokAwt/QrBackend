const mongoose = require("mongoose");
const WebsiteQrSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);
const WebsiteModel = mongoose.model("websiteQr", WebsiteQrSchema);
module.exports = WebsiteModel;
