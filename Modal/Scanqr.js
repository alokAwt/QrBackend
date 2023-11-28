const mongoose = require("mongoose");

const ScanQrschema = new mongoose.Schema(
  {
    UserId: {
      type: String,
      required: true,
    },
    QrId: {
      type: String,
    },
    DeviceName: {
      type: String,
      default: null,
    },
    Os: {
      type: String,
      default: null,
    },
    Lat: {
      type: String,
      default: null,
    },
    Lon: {
      type: String,
      default: null,
    },
    day: {
      type: String,
      default: null,
    },
    cityCode: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ScanModel = mongoose.model("Scan", ScanQrschema);
module.exports = ScanModel;
