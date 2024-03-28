const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/Audio");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const AudioRouter = express.Router();

AudioRouter.route("/Audio/Create").post(
  body("Url").notEmpty().withMessage("Website Url is required"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

AudioRouter.route("/Audio/GetAll").get(IsLogin, Isblocked, Getallqr);

AudioRouter.route("/Audio/getSingle/:id").get(IsLogin, Isblocked, GetSingleQr);

AudioRouter.route("/Audio/DeleteQr/:id").delete(IsLogin, Isblocked, DeleteQr);

AudioRouter.route("/Audio/update").put(IsLogin, Isblocked, UpdateQrData);

AudioRouter.route("/Audio/update/Images").put(IsLogin, Isblocked, updateQrImgaes);

module.exports = AudioRouter;
