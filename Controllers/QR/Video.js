const { validationResult } = require("express-validator");
const AppErr = require("../../Global/AppErr");
const UserModel = require("../../Modal/User");
const ScanModel = require("../../Modal/Scanqr");
const VideoModel = require("../../Modal/QR/Video");
const GenerateCustomizeQr = require("../../Global/CustomixedQr");
const cloudinary = require("cloudinary").v2;

//------------------------------CreateQr------------------------------------//
const CreateQr = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    //---------Getting UserDetails-----------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("user Not found", 404));
    }
    req.body.UserId = user._id;

    //---  Get Url from User
    let {
      Url,
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image,
      QrName,
    } = req.body;

    //---  Generate Unique ID
    const timestamp = new Date().getTime(); // Current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Random number (adjust as needed)
    let url = `https://qr-backend-ten.vercel.app/api/v1/Scan/Scanqr/Video/${timestamp}${randomPart}`;
    req.body.UniqueId = `${timestamp}${randomPart}`;

    //---  Create Qr based on that ID
    // let qr = GenerateQr(url);
    let qr = GenerateCustomizeQr(
      url,
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image
    );
    qr.then(async (qr) => {
      req.body.QrImage = qr;
      //---  Save the Deatils
      let NewQr = await VideoModel.create(req.body);

      //---Push in User Account-----//
      user.Qr.push(NewQr._id);
      await user.save();

      //---  Send Reponse
      return res.status(200).json({
        status: "success",
        data: NewQr,
      });
    }).catch((err) => {
      return next(new AppErr(err, 500));
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------------GETALLQR--------------------------------//

const Getallqr = async (req, res) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    let Qr = await VideoModel.find({
      UserId: req.user,
    });

    return res.status(200).json({
      message: "success",
      data: Qr,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------------GET SINGLE QR------------------------//

const GetSingleQr = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    let Qr = await VideoModel.findOne({ _id: req.params.id });
    if (!Qr) {
      return next(new AppErr("No Qr found", 404));
    }

    return res.status(200).json({
      message: "success",
      data: Qr,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------------UpdateQrs--------------------------//
const UpdateQrData = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    //--------------Finding User-------------------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    //--------------Finding Qr---------------------------//
    let getQr = await VideoModel.findOne({ UniqueId: req.body.UniqueId });
    if (!getQr) {
      return next(new AppErr("Qr not found", 404));
    }

    //------------Checking----------------------//
    if (user._id != getQr.UserId) {
      return next(new AppErr("You Dont't have access to edit this qr", 405));
    }

    let updatedata = await VideoModel.findByIdAndUpdate(
      getQr._id,
      {
        Url: req.body.Url,
        QrName: req.body.qrName,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      message: "success",
      data: updatedata,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//-------------------------------DeleteQr--------------------------//
const DeleteQr = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    //------------------------Finding User----------------------//
    let user = await UserModel.findById(req.user);
    let Qr = await VideoModel.findById(req.params.id);
    if (user._id != Qr.UserId) {
      return next(
        new AppErr("You dont have permission to Delete this Qr", 404)
      );
    }

    // //-----------Delete previous data------------------------//
    // const result = await cloudinary.uploader.destroy(Qr.PublicId);
    // if (result.result === "not found") {
    //   return next(new AppErr("Public Id Incorrect", 404));
    // }
    await VideoModel.findByIdAndDelete(req.params.id);
    const indexToRemove = user.Qr.findIndex((item) => item._id === Qr._id);
    if (indexToRemove !== -1) {
      user.Qr.splice(indexToRemove, 1);
    }
    await user.save();

    return res.status(200).json({
      message: "Success",
      data: "Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------Update Qr Imgaes ----------------------------//

const updateQrImgaes = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    //--------------Users------------------------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    //--------------Finding Qr---------------------------//
    let getQr = await VideoModel.findOne({ UniqueId: req.body.UniqueId });
    if (!getQr) {
      return next(new AppErr("Qr not found", 404));
    }

    //------------Checking----------------------//
    if (user._id != getQr.UserId) {
      return next(new AppErr("You Dont't have access to edit this qr", 405));
    }

    let {
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image,
    } = req.body;

    const timestamp = new Date().getTime(); // Current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Random number (adjust as needed)
    let url = `https://qr-backend-ten.vercel.app/api/v1/Scan/Scanqr/Video/${timestamp}${randomPart}`;

    let qr = GenerateCustomizeQr(
      url,
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image
    );
    qr.then(async (qr) => {
      let newimages = await VideoModel.findByIdAndUpdate(
        getQr._id,
        {
          QrImage: qr,
          UniqueId: `${timestamp}${randomPart}`,
        },
        { new: true }
      );

      return res.status(200).json({
        status: "success",
        data: newimages,
      });
    }).catch((err) => {
      return next(new AppErr(err, 500));
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------------------------------Analytices------------------------------------------//

module.exports = {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
};
