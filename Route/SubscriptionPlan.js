const express = require("express");
const { body, param } = require("express-validator");
const IsAdwin = require("../Middleware/IsAdmin");
const {
  CreatePlan,
  UpdatePlan,
  getAllPlan,
} = require("../Controllers/SuscriptionPlan");
const IsLogin = require("../Middleware/Islogin");
const Isblocked = require("../Middleware/IsBlocked");

const SuscriptionPlanRouter = express.Router();

SuscriptionPlanRouter.route("/Createplan").post(
  body("PlanType").notEmpty().withMessage("PlanType is required"),
  body("Price").notEmpty().withMessage("Price is required"),
  body("Duration").notEmpty().withMessage("Duration is required"),
  body("Discount").notEmpty().withMessage("Discount is required"),
  IsLogin,
  Isblocked,
  IsAdwin,
  CreatePlan
);

SuscriptionPlanRouter.route("/Updateplan/:id").put(
  param("id").notEmpty().withMessage("Params id is required"),
  body("PlanType").notEmpty().withMessage("PlanType is required"),
  body("Price").notEmpty().withMessage("Price is required"),
  body("Duration").notEmpty().withMessage("Duration is required"),
  body("Discount").notEmpty().withMessage("Discount is required"),
  IsLogin,
  Isblocked,
  IsAdwin,
  UpdatePlan
);

SuscriptionPlanRouter.route("/GetAllplan").get(getAllPlan);

module.exports = SuscriptionPlanRouter;
