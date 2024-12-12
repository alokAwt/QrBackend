const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const UserModel = require("../Modal/User");
const bcrypt = require("bcrypt");
const GenerateToken = require("../Global/GenerateToken");
const otpGenerator = require("otp-generator");
const SendEmail = require("../Global/SendOtp");
const WebsiteModel = require("../Modal/QR/WebsiteUrl");
const AudioModel = require("../Modal/QR/Audio");
const DocumnetModel = require("../Modal/QR/Document");
const GoogleMapModel = require("../Modal/QR/GoogleMap");
const ImageModel = require("../Modal/QR/Image");
const SocialMediaModel = require("../Modal/QR/SocialMedia");
const VideoModel = require("../Modal/QR/Video");
const PlayStoreModel = require("../Modal/QR/PlayStore");
const ScanModel = require("../Modal/Scanqr");
const SubcriptionModel = require("../Modal/Subscription");
var jwt = require("jsonwebtoken");

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    req.body.Password = hashedPassword;

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
    if (!userFound) {
      return next(new AppErr("User not Found"), 404);
    }

    //-------------------Chcek user Blocked or deledted--------//
    if (userFound.isDeleted) {
      return next(new AppErr("You account has been deleted", 200));
    }

    //-------------------Checking Password---------------------//
    const isPasswordMatch = await bcrypt.compare(Password, userFound.Password);
    if (!isPasswordMatch) {
      return next(new AppErr("Invalid Login Credentials / password", 404));
    }

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    req.body.Password = hashedPassword;

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
    const isPasswordMatch = await bcrypt.compare(Password, userFound.Password);
    if (!isPasswordMatch) {
      return next(new AppErr("Invalid Login Credentials / password", 404));
    }

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
    // const userFound = await UserModel.findOne({ Email });
    // if (!userFound) {
    //   return next(new AppErr("user not found", 404));
    // }

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

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
    let user = await UserModel.findById(req.user).lean();

    let fetchPromises = [];
    let qrModelNames = [
      WebsiteModel,
      PlayStoreModel,
      AudioModel,
      DocumnetModel,
      VideoModel,
      ImageModel,
      SocialMediaModel,
      GoogleMapModel,
    ];
    qrModelNames.forEach((modelName) => {
      fetchPromises.push(
        modelName
          .find({ _id: { $in: user.Qr } })
          .select("Url UniqueId Qrtype QrImage QrName")
          .lean()
      );
    });
    let fetchedResults = await Promise.all(fetchPromises);
    let combinedQrArray = fetchedResults.flatMap((result) => result);
    user.Qr = combinedQrArray;

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
    let userFound = await UserModel.findOne({ Email: Email });
    let userFound1 = await UserModel.findOne({ ContactNumber: ContactNumber });
    if (userFound) {
      return next(new AppErr("Email Already in Use", 404));
    }
    if (userFound1) {
      return next(new AppErr("ContactNumber Already in Use", 404));
    }

    // //-------------------Hash a Password-----------------------//
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    req.body.Password = hashedPassword;

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

//------------------Update Profile by admin-----------------------//
const UpdateProfilebyAdmin = async (req, res, next) => {
  try {
    //--------------------Validation Checking------------------------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { Name, Email, ContactNumber, id } = req.body;

    //------------------Update Users--------------------------------//
    let userUpdate = await UserModel.findByIdAndUpdate(
      id,
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
      data: "user Blocked",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------------UnBlock User By Admin-----------------------------//

const UnblockUser = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //--------------Getting UserId---------------//
    let user = await UserModel.findById(req.params.id);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    //----------------Unblock User------------------//
    let UserUpdate = await UserModel.findByIdAndUpdate(
      user._id,
      {
        isDeleted: false,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: UserUpdate,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------GetAllBlockedUser--------------------//
const getAllBlocked = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //--------------Getting UserId---------------//
    let user = await UserModel.find({
      isDeleted: true,
    });

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------Get All User---------------------------------//
const getAllUser = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //--------------Getting UserId---------------//
    let user = await UserModel.find({
      isDeleted: false,
    });

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//--------------------------Total qr code--------------------------//

const GetAllQr = async (req, res, next) => {
  try {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let website = await WebsiteModel.find().count();
    let Audio = await AudioModel.find().count();
    let Document = await DocumnetModel.find().count();
    let map = await GoogleMapModel.find().count();
    let images = await ImageModel.find().count();
    let Social = await SocialMediaModel.find().count();
    let Video = await VideoModel.find().count();
    let play = await PlayStoreModel.find().count();

    let AllScan = await ScanModel.find().count();
    let AllQr =
      website + Audio + Document + map + images + Video + play + Social;

    return res.status(200).json({
      status: "success",
      Qr: AllQr,
      Scan: AllScan,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------------Total Earning-------------------------//
const TotalEarining = async (req, res, next) => {
  try {
    let earn = await SubcriptionModel.find();
    console.log(earn);
    let price = 0;
    for (let i = 0; i < earn.length; i++) {
      price += earn[i].Price;
    }
    return res.status(200).json({
      status: "success",
      price: price,
      sub: earn.length,
    });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

//---------------------All Qr data----------------------------//

const AllQrdata = async (req, res, next) => {
  try {
    let website = await WebsiteModel.find().select("-__v"); // Exclude _id and __v fields
    let Audio = await AudioModel.find().select("-__v");
    let Document = await DocumnetModel.find().select("-__v");
    let map = await GoogleMapModel.find().select("-__v");
    let images = await ImageModel.find().select("-__v");
    let Social = await SocialMediaModel.find().select("-__v");
    let Video = await VideoModel.find().select("-__v");
    let play = await PlayStoreModel.find().select("-__v");

    // Add a new field to each document
    website = website.map((doc) => ({ ...doc.toObject(), type: "website" }));
    Audio = Audio.map((doc) => ({ ...doc.toObject(), type: "Audio" }));
    Document = Document.map((doc) => ({ ...doc.toObject(), type: "Document" }));
    map = map.map((doc) => ({ ...doc.toObject(), type: "map" }));
    images = images.map((doc) => ({ ...doc.toObject(), type: "images" }));
    Social = Social.map((doc) => ({ ...doc.toObject(), type: "Social" }));
    Video = Video.map((doc) => ({ ...doc.toObject(), type: "Video" }));
    play = play.map((doc) => ({ ...doc.toObject(), type: "playstore" }));

    let allData = []
      .concat(website)
      .concat(Audio)
      .concat(Document)
      .concat(map)
      .concat(images)
      .concat(Social)
      .concat(Video)
      .concat(play);

    return res.status(200).json({
      status: "success",
      data: allData,
    });
  } catch (error) {
    return next(new AppErr(error, 500));
  }
};

//------------------------Update Url by Admin-----------------------//
const UpdateQrDataByadmin = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    //--------------Finding User-------------------------//
    let user = await UserModel.findById(req.body.id);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    //--------------Finding Qr---------------------------//
    var updatedata;
    switch (req.body.type) {
      case "website": {
        let getQr = await WebsiteModel.findOne({ UniqueId: req.body.UniqueId });

        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await WebsiteModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );

        break;
      }
      case "Audio": {
        let getQr = await AudioModel.findOne({ UniqueId: req.body.UniqueId });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await AudioModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }
      case "Document": {
        let getQr = await DocumnetModel.findOne({
          UniqueId: req.body.UniqueId,
        });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await DocumnetModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }

      case "map": {
        let getQr = await GoogleMapModel.findOne({
          UniqueId: req.body.UniqueId,
        });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await GoogleMapModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }
      case "images": {
        let getQr = await ImageModel.findOne({ UniqueId: req.body.UniqueId });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await ImageModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }

      case "Social": {
        let getQr = await SocialMediaModel.findOne({
          UniqueId: req.body.UniqueId,
        });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await SocialMediaModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }

      case "Video": {
        let getQr = await VideoModel.findOne({ UniqueId: req.body.UniqueId });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await VideoModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }

      case "playstore": {
        let getQr = await PlayStoreModel.findOne({
          UniqueId: req.body.UniqueId,
        });
        if (!getQr) {
          return next(new AppErr("Qr not found", 404));
        }
        if (user._id != getQr.UserId) {
          return next(
            new AppErr("You Dont't have access to edit this qr", 405)
          );
        }

        updatedata = await PlayStoreModel.findByIdAndUpdate(
          getQr,
          {
            Url: req.body.Url,
          },
          {
            new: true,
          }
        );
        break;
      }
    }

    return res.status(200).json({
      message: "success",
      data: updatedata,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-----------------------Check Email and Number--------------------//
const UserCheck = async (req, res, next) => {
  try {
    let { email, number } = req.body;

    let user = await UserModel.findOne({ Email: email });
    if (user) {
      return next(new AppErr("Email already have account", 404));
    }
    let user2 = await UserModel.findOne({ ContactNumber: number });
    if (user2) {
      return next(new AppErr("Number already have account", 404));
    }

    return res.status(200).json({
      status: "success",
      data: true,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------Login With Google-------------------------//

const LoginWithGoogle = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    const { name, email } = decodedToken;
    const randomPart = Math.floor(Math.random() * 1000);
    let user = await UserModel.findOne({ Email: email });
    if (!user) {
      req.body.Email = email;
      req.body.Name = name;
      req.body.isUser = true;
      req.body.ContactNumber = randomPart;

      let newUser = await UserModel.create(req.body);

      let userToken = GenerateToken(newUser._id);

      return res.status(200).json({
        status: "success",
        token: userToken,
      });
    }

    return res.status(200).json({
      status: "success",
      token: GenerateToken(user._id),
    });
  } catch (error) {
    console.error("Error in LoginWithGoogle:", error);
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
  UnblockUser,
  getAllBlocked,
  getAllUser,
  GetAllQr,
  TotalEarining,
  AllQrdata,
  UpdateProfilebyAdmin,
  UpdateQrDataByadmin,
  UserCheck,
  LoginWithGoogle,
};
