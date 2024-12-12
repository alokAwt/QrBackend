const express = require("express");
const IsLogin = require("../Middleware/Islogin");
const Isblocked = require("../Middleware/IsBlocked");
const {
  CreateGamefication,
  ScanQrGame,
  SavePlayedGames,
  GetYourGames,
  CheckValidation,
  GetOwnCreatedGames,
  UpdateGames,
  ActivateANDdeactivate,
} = require("../Controllers/Gameification");
const { body } = require("express-validator");
const GameRouter = express.Router();

GameRouter.route("/game/Create").post(
  body("GameType").notEmpty().withMessage("Game Type is required"),
  body("Genderal.CompanyName")
    .notEmpty()
    .withMessage("CompanyName is required"),
  body("Genderal.CouponType").notEmpty().withMessage("CouponType is required"),
  body("Genderal.Couponsubtitle")
    .notEmpty()
    .withMessage(" Couponsubtitle is required"),
  body("Genderal.PoweredByName")
    .notEmpty()
    .withMessage("PoweredByName is required"),
  body("Genderal.PoweredByWebsite")
    .notEmpty()
    .withMessage("PoweredByWebsite is required"),
  body("Genderal.Appearsas").notEmpty().withMessage("Appearsas is required"),
  body("Genderal.TermsAndcondition")
    .notEmpty()
    .withMessage("TermsAndcondition is required"),
  body("Genderal.Logo").notEmpty().withMessage("Logo is required"),
  body("Genderal.StartDate").notEmpty().withMessage("StartDate is required"),
  body("Genderal.endDate").notEmpty().withMessage(" endDate is required"),
  body("PrizeSetting.MachineImage")
    .notEmpty()
    .withMessage("Game Image is required"),
  body("PrizeSetting.Limitaion")
    .notEmpty()
    .withMessage("Limitaion is required"),
  body("PrizeSetting.prize").notEmpty().withMessage("prize is required"),
  body("PrizeSetting.winner").notEmpty().withMessage("winner is required"),
  body("PrizeSetting.Losser").notEmpty().withMessage("Losser is required"),
  body("PrizeSetting.RetryAfterLoss")
    .notEmpty()
    .withMessage(" RetryAfterLoss is required"),
  body("ClaimAction.PersonalData")
    .notEmpty()
    .withMessage(" PersonalData is required"),
  body("ClaimAction.ButtonText")
    .notEmpty()
    .withMessage("ButtonText is required"),
  IsLogin,
  Isblocked,
  CreateGamefication
);

GameRouter.route("/ScanGame/:id").get(ScanQrGame);
GameRouter.route("/PlayGame").post(SavePlayedGames);
GameRouter.route("/getowngames/:id").get(GetYourGames);
GameRouter.route("/Validation/:id").post(CheckValidation);
GameRouter.route("/owncreatedGames").get(
  IsLogin,
  Isblocked,
  GetOwnCreatedGames
);

GameRouter.route("/updategames/:id").put(
  IsLogin,
  Isblocked,
  UpdateGames
);

GameRouter.route("/activateaction/:id").put(
  IsLogin,
  Isblocked,
  ActivateANDdeactivate
);

module.exports = GameRouter;
