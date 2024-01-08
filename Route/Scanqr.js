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

//---------------------Social Media------------------------//
ScanRouter.route("/SocialMedia/Scan").post(
  IsLogin,
  Isblocked,
  SocialMediaScanQr
);

//---------------------PlayStore--------------------------//
ScanRouter.route("/PlayStore/Scan").post(IsLogin, Isblocked, PlayStoreScanQr);

//----------------------Documents-------------------------//
ScanRouter.route("/Document/Scan").post(IsLogin, Isblocked, DocumnetScanQr);

//---------------------AUDIO-----------------------------//
ScanRouter.route("/Audio/Scan").post(IsLogin, Isblocked, AudioScanQr);

//---------------------Images-----------------------------//
ScanRouter.route("/Image/Scan").post(IsLogin, Isblocked, ImageScanQr);

//-------------------Video-------------------------------//
ScanRouter.route("/Video/Scan").post(IsLogin, Isblocked, VideoScanQr);

//--------------------Map---------------------------------//

//-----------------Analytices------------------------//

ScanRouter.route("/Scan/getanalytices").post(
  IsLogin,
  Isblocked,
  Issubcription,
  getAnalytics
);

module.exports = ScanRouter;
