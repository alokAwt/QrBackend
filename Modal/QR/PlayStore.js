const mongoose = require("mongoose");
const PlayStoreQrSchema = new mongoose.Schema(
  {
    UserId: {
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
      default: "PlayStore",
    },
  },
  {
    timestamps: true,
  }
);
const PlayStoreModel = mongoose.model("PlayStore", PlayStoreQrSchema);
module.exports = PlayStoreModel;
