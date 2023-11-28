const { validationResult } = require("express-validator");
const AppErr = require("../../Global/AppErr");
const UserModel = require("../../Modal/User");
const WebsiteModel = require("../../Modal/QR/WebsiteUrl");
const ScanModel = require("../../Modal/Scanqr");

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
    let qr = await WebsiteModel.create(req.body);
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

const ScanQr = async (req, res, next) => {
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
    let qr = await WebsiteModel.findOne({
      UniqueId: req.body.UniqueId,
    });
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

    let Qr = await WebsiteModel.find({
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

    let Qr = await WebsiteModel.findOne({ _id: req.params.id });
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
    let getQr = await WebsiteModel.findOne({ UniqueId: req.body.UniqueId });
    if (!getQr) {
      return next(new AppErr("Qr not found", 404));
    }

    //------------Checking----------------------//
    if (user._id != getQr.UserId) {
      return next(new AppErr("You Dont't have access to edit this qr", 405));
    }

    let updatedata = await WebsiteModel.findByIdAndUpdate(
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
    let Qr = await WebsiteModel.findById(req.params.id);
    console.log(Qr);
    if (user._id != Qr.UserId) {
      return next(
        new AppErr("You dont have permission to Delete this Qr", 404)
      );
    }
    await WebsiteModel.findByIdAndDelete(req.params.id);
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

const getAnalytics = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let { startDate, EndDate, UserId, QrId } = req.body;
    console.log(req.user);

    let jan = 0;
    let feb = 0;
    let march = 0;
    let april = 0;
    let may = 0;
    let june = 0;
    let july = 0;
    let augest = 0;
    let sept = 0;
    let oct = 0;
    let nov = 0;
    let dec = 0;

    //--------------------Week------------------------------//

    let sun = 0;
    let mon = 0;
    let tues = 0;
    let wed = 0;
    let thues = 0;
    let fri = 0;
    let sat = 0;

    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("user not found", 404));
    }

    let result = await ScanModel.find({
      $and: [
        {
          $and: [
            {
              $and: [
                {
                  createdAt: {
                    $gte: new Date(startDate).toISOString(),
                  },
                },
                {
                  createdAt: {
                    $lte: new Date(EndDate).toISOString(),
                  },
                },
              ],
            },
            {
              UserId: req.user,
            },
          ],
        },
        {
          QrId: QrId,
        },
      ],
    });

    result.forEach((item, index) => {
      let week = item.day;
      if (week == "Monday") {
        mon = mon + 1;
      } else if (week == "Tuesday") {
        tues = tues + 1;
      } else if (week == "Wednesday") {
        wed = wed + 1;
      } else if (week == "Thursday") {
        thues = thues + 1;
      } else if (week == "Friday") {
        fri = fri + 1;
      } else if (week == "Saturday") {
        sat = sat + 1;
      } else if (week == "Sunday") {
        sun = sun + 1;
      }
    });

    result.forEach((item, index) => {
      let month = new Date(item.createdAt).getMonth() + 1;
      if (month == 1) {
        jan = jan + 1;
      } else if (month == 2) {
        feb = feb + 1;
      } else if (month == 3) {
        march = march + 1;
      } else if (april == 4) {
        april = april + 1;
      } else if (month == 5) {
        may = may + 1;
      } else if (month == 6) {
        june = june + 1;
      } else if (month == 7) {
        july = july + 1;
      } else if (month == 8) {
        augest = augest + 1;
      } else if (month == 9) {
        sept = sept + 1;
      } else if (month == 10) {
        oct = oct + 1;
      } else if (month == 11) {
        nov = nov + 1;
      } else if (month == 12) {
        dec = dec + 1;
      }
    });

    //------------Grouping Data--------------------//
    // const WeekData = {};
    const timeData = {};
    const dateData = {};
    const OsData = {};
    const BrowserData = {};
    const DeviceData = {};
    const mapData = {};
    const citycode = {};

    //-------------------Date Time---------------------//
    result.forEach((item) => {
      let time = new Date(item.createdAt).getHours();
      if (!timeData[time]) {
        timeData[time] = 0;
      }
      timeData[time]++;
    });

    //-------------------Date-------------------------//
    result.forEach((item) => {
      let date = `${new Date(item.createdAt).getDate()}/${
        new Date(item.createdAt).getMonth() + 1
      }/${new Date(item.createdAt).getFullYear()}`;
      if (!dateData[date]) {
        dateData[date] = 0;
      }

      dateData[date]++;
    });

    //---------------OS AND DEVICE---------------//
    result.forEach((item) => {
      const os = item.os_family;

      if (!OsData[os]) {
        OsData[os] = 0;
      }
      OsData[os]++;
    });

    //---------------Device---------------//
    result.forEach((item) => {
      const Device = item.device_type;
      if (!DeviceData[Device]) {
        DeviceData[Device] = 0;
      }

      DeviceData[Device]++;
    });

    //------------Browser----------------//
    result.forEach((item) => {
      const Browser = item.browser_family;
      if (!BrowserData[Browser]) {
        BrowserData[Browser] = 0;
      }
      BrowserData[Browser]++;
    });

    //------------Map------------------//
    result.forEach((item) => {
      const map = item.city;
      if (!mapData[map]) {
        mapData[map] = 0;
      }
      mapData[map]++;
    });

    //-------------CityCode-------------//
    result.forEach((item) => {
      const city = item.region;
      if (!citycode[city]) {
        citycode[city] = 0;
      }
      citycode[city]++;
    });

    res.status(200).json({
      status: "success",
      TotalScans: result.length,
      result: result,
      month: {
        jan,
        feb,
        march,
        april,
        may,
        june,
        july,
        augest,
        sept,
        oct,
        nov,
        dec,
      },
      week: {
        mon,
        tues,
        wed,
        thues,
        fri,
        sat,
        sun,
      },
      time: timeData,
      date: dateData,
      Os: OsData,
      Browser: BrowserData,
      device: DeviceData,
      map: mapData,
      citycode: citycode,
    });

    return res.status(200).json({
      message: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreateQr,
  ScanQr,
  Getallqr,
  GetSingleQr,
  DeleteQr,
  UpdateQrData,
  getAnalytics,
};
