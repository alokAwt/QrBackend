const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/WebsiteUrl");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const WebsiteRouter = express.Router();

WebsiteRouter.route("/Websiteurl/Create").post(
  body("Url").notEmpty().withMessage("Website Url is required"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

WebsiteRouter.route("/Websiteurl/GetAll").get(IsLogin, Isblocked, Getallqr);

WebsiteRouter.route("/Websiteurl/getSingle/:id").get(
  IsLogin,
  Isblocked,
  GetSingleQr
);

WebsiteRouter.route("/Websiteurl/DeleteQr/:id").delete(
  IsLogin,
  Isblocked,
  DeleteQr
);

WebsiteRouter.route("/Websiteurl/update").put(IsLogin, Isblocked, UpdateQrData);

WebsiteRouter.route("/Websiteurl/update/Images").put(
  IsLogin,
  Isblocked,
  updateQrImgaes
);

module.exports = WebsiteRouter;
