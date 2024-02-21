const express = require("express");
const ContactRouter = express.Router();
const {
  CreateContact,
  GetAllContactUs,
  DeleteContact,
} = require("../Controllers/Contact");
const { body } = require("express-validator");
const IsLogin = require("../Middleware/Islogin");
const IsAdwin = require("../Middleware/IsAdmin");

ContactRouter.route("/CreateContact").post(
  body("FirstName").notEmpty().withMessage("First Name is required"),
  body("LastName").notEmpty().withMessage("Lat Name is required"),
  body("Email").notEmpty().withMessage("Email is required"),
  body("Subject").notEmpty().withMessage("Subject is required"),
  body("Message").notEmpty().withMessage("Message is required"),
  CreateContact
);

ContactRouter.route("/GetAllContact").get(IsLogin, IsAdwin, GetAllContactUs);
ContactRouter.route("/deleteContact").delete(IsLogin, IsAdwin, DeleteContact);

module.exports = ContactRouter;
