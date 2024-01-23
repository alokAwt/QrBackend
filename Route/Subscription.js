const express = require("express");
const { body } = require("express-validator");
const IsLogin = require("../Middleware/Islogin");
const Isblocked = require("../Middleware/IsBlocked");
const {
  CreateSubcription,
  CreateOrder,
  PayAmount,
  getAllSubscriptions,
  getAllSubscriptionsByAdmin,
} = require("../Controllers/Subcription");
const IsAdwin = require("../Middleware/IsAdmin");
const SuscriptionRouter = express.Router();

SuscriptionRouter.route("/Createorder").post(
  body("Price").notEmpty().withMessage("Price is not available"),
  IsLogin,
  Isblocked,
  CreateOrder
);

SuscriptionRouter.route("/Pay").post(
  body("Price").notEmpty().withMessage("Price is not available"),
  IsLogin,
  Isblocked,
  PayAmount
);

SuscriptionRouter.route("/GetOwnSub").get(
  IsLogin,
  Isblocked,
  getAllSubscriptions
);

SuscriptionRouter.route("/Admin/GetAllSub").get(
  IsLogin,
  IsAdwin,
  Isblocked,
  getAllSubscriptionsByAdmin
);

module.exports = SuscriptionRouter;
