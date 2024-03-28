const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/Image");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const ImageRouter = express.Router();

ImageRouter.route("/Image/Create").post(
  body("Url").notEmpty().withMessage("Website Url is required"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

ImageRouter.route("/Image/GetAll").get(IsLogin, Isblocked, Getallqr);

ImageRouter.route("/Image/getSingle/:id").get(IsLogin, Isblocked, GetSingleQr);

ImageRouter.route("/Image/DeleteQr/:id").delete(IsLogin, Isblocked, DeleteQr);

ImageRouter.route("/Image/update").put(IsLogin, Isblocked, UpdateQrData);

ImageRouter.route("/Image/update/Images").put(
  IsLogin,
  Isblocked,
  updateQrImgaes
);

module.exports = ImageRouter;
