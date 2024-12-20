const { validationResult } = require("express-validator");
const AppErr = require("../../Global/AppErr");
const UserModel = require("../../Modal/User");
const WebsiteModel = require("../../Modal/QR/WebsiteUrl");
const ScanModel = require("../../Modal/Scanqr");
const GenerateQr = require("../../Global/GenerateQr");
const GoogleMapModel = require("../../Modal/QR/GoogleMap");
const GenerateCustomizeQr = require("../../Global/CustomixedQr");
//------------------------------CreateQr------------------------------------//
const CreateQr = async (req, res, next) => {
  try {
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
      lat,
      lon,
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image,
      QrName
    } = req.body;

    //---  Generate Unique ID
    const timestamp = new Date().getTime(); // Current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Random number (adjust as needed)
    let url = `https://qr-backend-ten.vercel.app/api/v1/Scan/Scanqr/Map/${timestamp}${randomPart}`;
    req.body.UniqueId = `${timestamp}${randomPart}`;

    //---  Create Qr based on that ID
    // let qr = GenerateQr(url);
    let qr = GenerateCustomizeQr(
      url,
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image,
    
    );
    qr.then(async (qr) => {
      req.body.QrImage = qr;
      req.body.Url = `https://www.google.com/maps?q=${lat},${lon}&z=17&hl=en`;
      //---  Save the Deatils
      let NewQr = await GoogleMapModel.create(req.body);

      //---Push in User Account-----//
      user.Qr.push(NewQr._id);
      await user.save();

      //---  Send Reponse
      return res.status(200).json({
        status: "success",
        data: NewQr,
      });
    }).catch((error) => {
      return next(new AppErr(error, 500));
    });
  } catch (error) {
    return next(new AppErr(error, 500));
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

    let Qr = await GoogleMapModel.find({
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

    let Qr = await GoogleMapModel.findOne({ _id: req.params.id });
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

    let { lat, lon } = req.body;
    //--------------Finding User-------------------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    //--------------Finding Qr---------------------------//
    let getQr = await GoogleMapModel.findOne({ UniqueId: req.body.UniqueId });
    if (!getQr) {
      return next(new AppErr("Qr not found", 404));
    }

    //------------Checking----------------------//
    if (user._id != getQr.UserId) {
      return next(new AppErr("You Dont't have access to edit this qr", 405));
    }

    let updatedata = await GoogleMapModel.findByIdAndUpdate(
      getQr,
      {
        lat,
        lon,
        Url: `https://www.google.com/maps?q=${lat},${lon}&z=17&hl=en`,
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
    let Qr = await GoogleMapModel.findById(req.params.id);
    console.log(Qr);
    if (user._id != Qr.UserId) {
      return next(
        new AppErr("You dont have permission to Delete this Qr", 404)
      );
    }
    await GoogleMapModel.findByIdAndDelete(req.params.id);
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
    let getQr = await GoogleMapModel.findOne({ UniqueId: req.body.UniqueId });
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
    let url = `https://qr-backend-ten.vercel.app/api/v1/Scan/Scanqr/Map/${timestamp}${randomPart}`;

    let qr = GenerateCustomizeQr(
      url,
      dotoption,
      backgroundOption,
      cornersOptions,
      cornersDotOptions,
      image
    );
    qr.then(async (qr) => {
      let newimages = await GoogleMapModel.findByIdAndUpdate(
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

module.exports = {
  CreateQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  updateQrImgaes,
};
