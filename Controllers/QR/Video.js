const { validationResult } = require("express-validator");
const AppErr = require("../../Global/AppErr");
const UserModel = require("../../Modal/User");

const ScanModel = require("../../Modal/Scanqr");
const VideoModel = require("../../Modal/QR/Video");

//------------------------------CreateQr------------------------------------//
const CreateQr = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //-----------------Finding user--------------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }
    req.body.UserId = req.user;

    let { QrImage, Url, UniqueId } = req.body;
    //-----------------Creating Qr---------------------//
    let qr = await VideoModel.create(req.body);
    user.Qr.push(qr._id);
    await user.save();

    return res.status(200).json({
      message: "success",
      data: qr,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//---------------------Scan Data------------------------//

const VideoScanQr = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //------------------Finding Users---------------------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    //-----------------Finding Qr-----------------------------//
    let qr = await VideoModel.findOne({
      UniqueId: req.body.UniqueId,
    });
    console.log("alok", qr);
    if (!qr) {
      return next("Url Not Found", 404);
    }
    //-----------------Saving Scan-------------------------//
    req.body.QrId = qr._id;
    req.body.UserId = req.user;
    let scan = await ScanModel.create(req.body);
    qr.ScanId.push(scan._id);
    await qr.save();

    return res.status(200).json({
      message: "Success",
      data: qr,
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
      return next(new AppErr(err.errors[0].msg, 403));
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
      return next(new AppErr(err.errors[0].msg, 403));
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
      return next(new AppErr(err.errors[0].msg, 403));
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
      getQr,
      {
        Url: req.body.Url,
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
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //------------------------Finding User----------------------//
    let user = await UserModel.findById(req.user);
    let Qr = await VideoModel.findById(req.params.id);
    if (user._id != Qr.UserId) {
      return next(
        new AppErr("You dont have permission to Delete this Qr", 404)
      );
    }
    await VideoModel.findByIdAndDelete(req.params.id);
    user.Qr.pop(Qr._id);
    await user.save();

    return res.status(200).json({
      message: "Success",
      data: "Deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//------------------------------------------Analytices------------------------------------------//


module.exports = {
  CreateQr,
  VideoScanQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  // getAnalytics,
};
