const mongoose = require("mongoose");

const GoogleMapSchama = new mongoose.Schema(
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

    lat: {
      type: String,
      required: true,
    },
    lon: {
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
      default: "GoogleMap",
    },
  },
  {
    timestamps: true,
  }
);

const GoogleMapModel = mongoose.model("Map", GoogleMapSchama);
module.exports = GoogleMapModel;
