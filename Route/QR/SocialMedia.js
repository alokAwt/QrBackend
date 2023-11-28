const express = require("express");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  getAnalytics,
} = require("../../Controllers/QR/SocialMedia");
const IsLogin = require("../../Middleware/Islogin");
const Isblocked = require("../../Middleware/IsBlocked");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");

const SocialMediaRouter = express.Router();

SocialMediaRouter.route("/SocialMediaurl/Create").post(
  body("QrImage").notEmpty().withMessage("QrImage is required"),
  body("Url").notEmpty().withMessage("Website Url isrequired"),
  IsLogin,
  Isblocked,
  Issubcription,
  CreateQr
);

SocialMediaRouter.route("/SocialMediaurl/GetAll").get(
  IsLogin,
  Isblocked,
  Getallqr
);

SocialMediaRouter.route("/SocialMediaurl/getSingle/:id").get(
  IsLogin,
  Isblocked,
  GetSingleQr
);

SocialMediaRouter.route("/SocialMediaurl/DeleteQr/:id").delete(
  IsLogin,
  Isblocked,
  DeleteQr
);

SocialMediaRouter.route("/SocialMediaurl/update").put(
  IsLogin,
  Isblocked,
  UpdateQrData
);

module.exports = SocialMediaRouter;
