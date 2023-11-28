const mongoose = require("mongoose");
const PlayStoreQrSchema = new mongoose.Schema(
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
const PlayStoreModel = mongoose.model("PlayStore", PlayStoreQrSchema);
module.exports = PlayStoreModel;
