const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/Text");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const TextRouter = express.Router();

TextRouter.route("/Text/Create").post(
  body("Url").notEmpty().withMessage("Text is required"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

TextRouter.route("/Text/GetAll").get(IsLogin, Isblocked, Getallqr);

TextRouter.route("/Text/getSingle/:id").get(IsLogin, Isblocked, GetSingleQr);

TextRouter.route("/Text/DeleteQr/:id").delete(IsLogin, Isblocked, DeleteQr);

TextRouter.route("/Text/update").put(IsLogin, Isblocked, UpdateQrData);

TextRouter.route("/Text/update/Images").put(IsLogin, Isblocked, updateQrImgaes);

module.exports = TextRouter;
