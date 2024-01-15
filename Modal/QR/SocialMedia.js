const mongoose = require("mongoose");
const SocialMediaSchema = new mongoose.Schema(
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
const SocialMediaModel = mongoose.model("SocialMediaQr", SocialMediaSchema);
module.exports = SocialMediaModel;
