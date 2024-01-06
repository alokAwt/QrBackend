const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const UserModel = require("../Modal/User");
// const bcrypt = require("bcrypt");
const GenerateToken = require("../Global/GenerateToken");
const otpGenerator = require("otp-generator");
const SendEmail = require("../Global/SendOtp");

//-----------------------SignUp User------------------------//

const SignUpuserCtrl = async (req, res, next) => {
  try {
    //-------------------Validation Check-----------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, ContactNumber, Email, Password } = req.body;

    //--------------------Check users--------------------------//
    let userFound = await UserModel.find({ Email: Email });
    let userFound1 = await UserModel.find({ ContactNumber: ContactNumber });
    if (userFound.length > 0) {
      return next(new AppErr("Email Already in Use", 404));
    }
    if (userFound1.length > 0) {
      return next(new AppErr("ContactNumber Already in Use", 404));
    }

    //-------------------Hash a Password-----------------------//
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(Password, salt);
    // req.body.Password = hashedPassword;

    //-------------------Assigning Role-----------------------//
    req.body.isUser = true;

    //-------------------Createing Users----------------------//
    let user = await UserModel.create(req.body);
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------------------SignIn User---------------------//

const SigninCtrl = async (req, res, next) => {
  try {
    //-------------------Validation Check-----------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Email, Password } = req.body;
    //-------------------Check Users--------------------------//
    let userFound = await UserModel.findOne({ Email: Email });
    if (userFound.length > 0) {
      return next(new AppErr("User not Found"), 404);
    }

    //-------------------Chcek user Blocked or deledted--------//
    if (userFound.isDeleted) {
      return next(new AppErr("You account has been deleted", 200));
    }

    //-------------------Checking Password---------------------//
    // const isPasswordMatch = await bcrypt.compare(Password, userFound.Password);
    // if (!isPasswordMatch) {
    //   return next(new AppErr("Invalid Login Credentials / password", 404));
    // }

    //-----------------Generate Token----------------------//
    let Token = GenerateToken(userFound._id);

    return res.status(200).json({
      message: "success",
      data: userFound,
      token: Token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------------SignUp User------------------------//

const SignUpAdwinCtrl = async (req, res, next) => {
  try {
    //-------------------Validation Check-----------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, ContactNumber, Email, Password } = req.body;

    //--------------------Check users--------------------------//
    let userFound = await UserModel.find({ Email: Email });
    let userFound1 = await UserModel.find({ ContactNumber: ContactNumber });
    if (userFound.length > 0) {
      return next(new AppErr("Email Already in Use", 404));
    }
    if (userFound1.length > 0) {
      return next(new AppErr("ContactNumber Already in Use", 404));
    }

    //-------------------Hash a Password-----------------------//
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(Password, salt);
    // req.body.Password = hashedPassword;

    //-------------------Assigning Role-----------------------//
    req.body.isAdwin = true;

    //-------------------Createing Users----------------------//
    let user = await UserModel.create(req.body);
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------------------SignIn Adwin---------------------//

const SigninAdwinCtrl = async (req, res, next) => {
  try {
    //-------------------Validation Check-----------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Email, Password } = req.body;
    //-------------------Check Users--------------------------//
    let userFound = await UserModel.findOne({ Email: Email });
    if (userFound.length > 0) {
      return next(new AppErr("User not Found"), 404);
    }

    //-------------------Checking Password---------------------//
    // const isPasswordMatch = await bcrypt.compare(Password, userFound.Password);
    // if (!isPasswordMatch) {
    //   return next(new AppErr("Invalid Login Credentials / password", 404));
    // }

    //-----------------Generate Token----------------------//
    let Token = GenerateToken(userFound._id);

    return res.status(200).json({
      message: "success",
      data: userFound,
      token: Token,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------------Send Otp -----------------------------//

const SendOtp = async (req, res, next) => {
  try {
    //------------Validation Checking----------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Email } = req.body;

    //-----------Checking Email--------------------------//
    const userFound = await UserModel.findOne({ Email });
    if (!userFound) {
      return next(new AppErr("user not found", 404));
    }

    //--------Generate Otp-------------//
    let otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    //---------Email Send---------------//
    SendEmail(Email, otp).catch((err) => {
      return next(new AppErr(err, 500));
    });
    return res.status(200).json({
      message: "success",
      otp: otp,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------------------------Reset Password------------------------------------------//

const ResetPassword = async (req, res, next) => {
  try {
    //--------------------Validation Checking------------------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    //--------------------Checking Email-------------------------//
    let { Email, Password } = req.body;
    let userFound = await UserModel.findOne({ Email });
    if (!userFound) {
      return next(new AppErr("Email not found", 404));
    }

    // //--------------------Hasing Password-------------------------//
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(Password, salt);

    //------------------Update Password-------------------//
    const user = await UserModel.findByIdAndUpdate(
      userFound._id,
      {
        Password: hashedPassword,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------------------Delete Own Account-----------------------//

const DeleteOwnAccount = async (req, res, next) => {
  try {
    let userFound = await UserModel.findById(req.user);
    if (!userFound) {
      return next(new AppErr("User not found"), 404);
    }

    let user = await UserModel.findByIdAndUpdate(req.user, {
      isDeleted: true,
    });

    return res.status(200).json({
      message: "success",
      data: "user Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------------------Get Own Profile----------------------------//
const getOwnProfile = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("user Not Found", 500));
    }

    return res.status(200).json({
      message: "status",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------Update Own Profile-----------------------------------//
const UpdateProfile = async (req, res, next) => {
  try {
    //--------------------Validation Checking------------------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, Email, ContactNumber } = req.body;
    //-------------------Find User---------------------------------------//
    let users = await UserModel.findById(req.user);
    if (!users) {
      return next(new AppErr("user not found", 404));
    }

    //--------------------CheckEmail--------------------------------//
    let userfound = await UserModel.findOne({ Email });
    if (userfound) {
      return next(new AppErr("email already in use", 404));
    }

    //-------------------Check Number----------------------------//
    let userfound1 = await UserModel.findOne({ ContactNumber });
    if (userfound1) {
      return next(new AppErr("ContactNumber already in use", 404));
    }
    //------------------Update Users--------------------------------//
    let userUpdate = await UserModel.findByIdAndUpdate(
      users._id,
      {
        Name: Name,
        Email: Email,
        ContactNumber: ContactNumber,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "success",
      data: userUpdate,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------------Create Account By Adwin-----------------------------------//
const CreateAccountByAdwin = async (req, res, next) => {
  try {
    //-------------------Validation Check-----------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, ContactNumber, Email, Password } = req.body;

    //--------------------Check users--------------------------//
    let userFound = await UserModel.find({ Email: Email });
    let userFound1 = await UserModel.find({ ContactNumber: ContactNumber });
    if (userFound.length > 0) {
      return next(new AppErr("Email Already in Use", 404));
    }
    if (userFound1.length > 0) {
      return next(new AppErr("ContactNumber Already in Use", 404));
    }

    // //-------------------Hash a Password-----------------------//
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(Password, salt);
    // req.body.Password = hashedPassword;

    //-------------------Assigning Role-----------------------//
    req.body.isUser = true;

    //-------------------Createing Users----------------------//
    let user = await UserModel.create(req.body);
    return res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------------Block User by Adwin---------------------//

const DeleteAccountbyAdwn = async (req, res, next) => {
  try {
    let userFound = await UserModel.findById(req.params.id);
    if (!userFound) {
      return next(new AppErr("User not found"), 404);
    }

    let user = await UserModel.findByIdAndUpdate(
      userFound._id,
      {
        isDeleted: true,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "success",
      data: "user Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
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
};
