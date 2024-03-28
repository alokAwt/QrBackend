const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/Video");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const VideoRouter = express.Router();


VideoRouter.route("/Video/Create").post(
  body("Url").notEmpty().withMessage("Website Url is required"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

VideoRouter.route("/Video/GetAll").get(IsLogin, Isblocked, Getallqr);

VideoRouter.route("/Video/getSingle/:id").get(IsLogin, Isblocked, GetSingleQr);

VideoRouter.route("/Video/DeleteQr/:id").delete(IsLogin, Isblocked, DeleteQr);

VideoRouter.route("/Video/update").put(IsLogin, Isblocked, UpdateQrData);

VideoRouter.route("/Video/update/Images").put(IsLogin, Isblocked, updateQrImgaes);

module.exports = VideoRouter;
