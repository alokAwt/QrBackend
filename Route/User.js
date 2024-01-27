const express = require("express");
const UserRouter = express.Router();
const {
  SignUpuserCtrl,
  SigninCtrl,
  SignUpAdwinCtrl,
  SigninAdwinCtrl,
  SendOtp,
  ResetPassword,
  DeleteOwnAccount,
  getOwnProfile,
  UpdateProfile,
  CreateAccountByAdwin,
  DeleteAccountbyAdwn,
  UnblockUser,
  getAllBlocked,
} = require("../Controllers/User");
const { body, param } = require("express-validator");
const IsLogin = require("../Middleware/Islogin");
const Isblocked = require("../Middleware/IsBlocked");
const IsAdwin = require("../Middleware/IsAdmin");

UserRouter.route("/Signup").post(
  body("Name").notEmpty().withMessage("Name is Required"),
  body("ContactNumber").notEmpty().withMessage("Contact Number is Required"),
  body("Email").notEmpty().withMessage("Email is Required"),
  body("Email").notEmpty().withMessage("Email must be a valid email address"),
  body("Password").notEmpty().withMessage("Password is Required"),
  body("Password")
    .isLength({ min: 8, max: 16 })
    .withMessage("password must be at least 8 characters"),
  SignUpuserCtrl
);

UserRouter.route("/Signin").post(
  body("Email").notEmpty().withMessage("Email must be a valid email address"),
  body("Password").notEmpty().withMessage("Password is Required"),
  body("Password")
    .isLength({ min: 8, max: 16 })
    .withMessage("password must be at least 8 characters"),
  SigninCtrl
);

UserRouter.route("/Signup/Adwin").post(
  body("Name").notEmpty().withMessage("Name is Required"),
  body("ContactNumber").notEmpty().withMessage("Contact Number is Required"),
  body("Email").notEmpty().withMessage("Email is Required"),
  body("Email").notEmpty().withMessage("Email must be a valid email address"),
  body("Password").notEmpty().withMessage("Password is Required"),
  body("Password")
    .isLength({ min: 8, max: 16 })
    .withMessage("password must be at least 8 characters"),
  SignUpAdwinCtrl
);

UserRouter.route("/Signin/Adwin").post(
  body("Email").notEmpty().withMessage("Email must be required"),
  body("Password").notEmpty().withMessage("Password is Required"),
  body("Password")
    .isLength({ min: 8, max: 16 })
    .withMessage("password must be at least 8 characters"),
  SigninAdwinCtrl
);

UserRouter.route("/otp").post(
  body("Email").notEmpty().withMessage("Email must be required"),
  body("Email").notEmpty().withMessage("Email must be a valid email address"),
  SendOtp
);

UserRouter.route("/ResetPassword").put(
  body("Email").notEmpty().withMessage("Email must be required"),
  body("Email").notEmpty().withMessage("Email must be a valid email address"),
  body("Password").notEmpty().withMessage("Password is Required"),
  body("Password")
    .isLength({ min: 8, max: 16 })
    .withMessage("password must be at least 8 characters"),
  ResetPassword
);

UserRouter.route("/DeleteAccount").post(IsLogin, DeleteOwnAccount);

UserRouter.route("/profile").get(IsLogin, Isblocked, getOwnProfile);

UserRouter.route("/UpdateUser").put(IsLogin, Isblocked, UpdateProfile);

UserRouter.route("/Createaccountbyadwin").post(
  body("Name").notEmpty().withMessage("Name is Required"),
  body("ContactNumber").notEmpty().withMessage("Contact Number is Required"),
  body("Email").notEmpty().withMessage("Email is Required"),
  body("Email").notEmpty().withMessage("Email must be a valid email address"),
  body("Password").notEmpty().withMessage("Password is Required"),
  body("Password")
    .isLength({ min: 8, max: 16 })
    .withMessage("password must be at least 8 characters"),
  IsLogin,
  IsAdwin,
  CreateAccountByAdwin
);

UserRouter.route("/deleteAccountByAdwin/:id").put(
  param("id").notEmpty().withMessage("Params id is required"),
  IsLogin,
  IsAdwin,
  DeleteAccountbyAdwn
);

UserRouter.route("/Unblock/:id").put(
  param("id").notEmpty().withMessage("Params id is required"),
  IsLogin,
  IsAdwin,
  UnblockUser
);

UserRouter.route("/blockUser").get(
  IsLogin,
  IsAdwin,
  getAllBlocked
);

module.exports = UserRouter;
