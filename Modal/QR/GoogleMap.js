const mongoose = require("mongoose");

const GoogleMapSchama = new mongoose.Schema(
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
    Location: {
      lat: {
        type: String,
        required: true,
      },
      lon: {
        type: String,
        required: true,
      },
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

const GoogleMapModel = mongoose.model("Map", GoogleMapSchama);
module.exports = GoogleMapModel;
