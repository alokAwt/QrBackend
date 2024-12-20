const express = require("express");
const IsLogin = require("../../Middleware/Islogin");
const {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
} = require("../../Controllers/QR/PlayStore");
const Issubcription = require("../../Middleware/IsSubcriptionTaken");
const { body } = require("express-validator");
const Isblocked = require("../../Middleware/IsBlocked");
const PlayStoreRouter = express.Router();

PlayStoreRouter.route("/PlayStore/Create").post(
  body("Url").notEmpty().withMessage("Website Url is required"),
  IsLogin,
  Isblocked,
  // Issubcription,
  CreateQr
);

PlayStoreRouter.route("/PlayStore/GetAll").get(IsLogin, Isblocked, Getallqr);

PlayStoreRouter.route("/PlayStore/getSingle/:id").get(
  IsLogin,
  Isblocked,
  GetSingleQr
);

PlayStoreRouter.route("/PlayStore/DeleteQr/:id").delete(
  IsLogin,
  Isblocked,
  DeleteQr
);

PlayStoreRouter.route("/PlayStore/update").put(
  IsLogin,
  Isblocked,
  UpdateQrData
);

PlayStoreRouter.route("/PlayStore/update/Images").put(
  IsLogin,
  Isblocked,
 updateQrImgaes
);

module.exports = PlayStoreRouter;
