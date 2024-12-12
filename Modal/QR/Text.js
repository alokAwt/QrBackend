const mongoose = require("mongoose");
const TextQrSchema = new mongoose.Schema(
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
      default: "Text",
    },
    PublicId: {
      type: String,
     
    },
  },
  {
    timestamps: true,
  }
);
const TextModel = mongoose.model("Text", TextQrSchema);
module.exports = TextModel;