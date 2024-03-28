const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/Document");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const DocumentRouter = express.Router();

DocumentRouter.route("/document/Create").post(
  body("Url").notEmpty().withMessage("Website Url isrequired"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

DocumentRouter.route("/document/GetAll").get(IsLogin, Isblocked, Getallqr);

DocumentRouter.route("/document/getSingle/:id").get(
  IsLogin,
  Isblocked,
  GetSingleQr
);

DocumentRouter.route("/document/DeleteQr/:id").delete(
  IsLogin,
  Isblocked,
  DeleteQr
);

DocumentRouter.route("/document/update").put(IsLogin, Isblocked, UpdateQrData);

DocumentRouter.route("/document/update/Images").put(IsLogin, Isblocked, updateQrImgaes);

module.exports = DocumentRouter;
