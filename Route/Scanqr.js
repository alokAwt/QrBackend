const express = require("express");
const ScanRouter = express.Router();
const IsLogin = require("../Middleware/Islogin");
const Isblocked = require("../Middleware/IsBlocked");
const Issubcription = require("../Middleware/IsSubcriptionTaken");
const { ScanQr, getAnalytics } = require("../Controllers/ScanQr");

//---------------------WebsiteUrl--------------------------//
ScanRouter.route("/Scanqr/:type/:id").get(ScanQr);

ScanRouter.route("/Scan/getanalytices").post(
  IsLogin,
  Isblocked,
  Issubcription,
 getAnalytics
);

module.exports = ScanRouter;
