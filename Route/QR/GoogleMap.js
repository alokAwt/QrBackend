const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
} = require("../../Controllers/QR/GoogleMap");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const GooglemapRouter = express.Router();

GooglemapRouter.route("/Googlemap/Create").post(
  body("lat").notEmpty().withMessage("Latitude is required"),
  body("lon").notEmpty().withMessage("Longitude is required"),
  IsLogin,
  Isblocked,
  Issubcription,
  CreateQr
);

GooglemapRouter.route("/Googlemap/GetAll").get(IsLogin, Isblocked, Getallqr);

GooglemapRouter.route("/Googlemap/getSingle/:id").get(
  IsLogin,
  Isblocked,
  GetSingleQr
);

GooglemapRouter.route("/Googlemap/DeleteQr/:id").delete(
  IsLogin,
  Isblocked,
  DeleteQr
);

GooglemapRouter.route("/Googlemap/update").put(IsLogin, Isblocked, UpdateQrData);

module.exports = GooglemapRouter;
