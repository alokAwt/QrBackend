const express = require("express");
const ScanRouter = express.Router();
const IsLogin = require("../Middleware/Islogin");
const Isblocked = require("../Middleware/IsBlocked");
const { ScanQr, getAnalytics } = require("../Controllers/QR/WebsiteUrl");
const Issubcription = require("../Middleware/IsSubcriptionTaken");
const { SocialMediaScanQr } = require("../Controllers/QR/SocialMedia");
const { PlayStoreScanQr } = require("../Controllers/QR/PlayStore");
const { DocumnetScanQr } = require("../Controllers/QR/Document");
const { AudioScanQr } = require("../Controllers/QR/Audio");
const { ImageScanQr } = require("../Controllers/QR/Image");
const { VideoScanQr } = require("../Controllers/QR/Video");

//---------------------WebsiteUrl--------------------------//
ScanRouter.route("/Scanqr/:type/:id").get(ScanQr);

ScanRouter.route("/Scan/getanalytices").post(
  IsLogin,
  Isblocked,
  Issubcription,
  getAnalytics
);

module.exports = ScanRouter;
