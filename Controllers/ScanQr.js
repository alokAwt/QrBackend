const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const SocialMediaModel = require("../Modal/QR/SocialMedia");
const WebsiteModel = require("../Modal/QR/WebsiteUrl");
const PlayStoreModel = require("../Modal/QR/PlayStore");
const VideoModel = require("../Modal/QR/Video");
const ImageModel = require("../Modal/QR/Image");
const GoogleMapModel = require("../Modal/QR/GoogleMap");
const DocumnetModel = require("../Modal/QR/Document");
const AudioModel = require("../Modal/QR/Audio");
const UserModel = require("../Modal/User");
const ScanModel = require("../Modal/Scanqr");
const axios = require("axios");

const ScanQr = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    //---   get req.query unique id along with type
    let type = req.params.type;
    let id = req.params.id;

    //---   Fetch Qr details
    var qr;
    switch (type) {
      case "Website": {
        qr = await WebsiteModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "SocialMedia": {
        qr = await SocialMediaModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "Playstore": {
        qr = await PlayStoreModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "Video": {
        qr = await VideoModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "Image": {
        qr = await ImageModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "Map": {
        qr = await GoogleMapModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "document": {
        qr = await DocumnetModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      case "Audio": {
        qr = await AudioModel.findOne({ UniqueId: id });
        if (!qr) {
          return next(new AppErr("Qr details not found", 500));
        }
        break;
      }
      default: {
        return next(new AppErr("Wrong Qr Scaned", 500));
      }
    }

    const userIp = req.headers["user-agent"];
    const ipv6Address =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const browserRegex = /(Chrome|Safari|Firefox|Edge|IE|Opera)\/(\S+)/i;
    const osRegex =
      /(Windows NT|Windows|Macintosh|Linux|Android|iOS|iPad|iPhone) (\S+)/i;
    const browserMatch = userIp.match(browserRegex);
    const osMatch = userIp.match(osRegex);
    const browser = browserMatch ? browserMatch[1] : "Unknown Browser";
    const operatingSystem = osMatch ? `${osMatch[1]}` : "Unknown OS";

    const response = await axios.get(
      `https://api.ip2location.io/?key=FF1FAF0872E080F0547180EE1A5796B2&ip=${ipv6Address}`
    );
    const data = response.data;
    console.log(data);

    //---   decode data of user
    req.body.QrId = qr._id;
    req.body.UserId = qr.UserId;
    req.body.DeviceName = browser;
    req.body.Os = operatingSystem;
    req.body.Lat = data.latitude;
    req.body.Lon = data.longitude;
    req.body.Country = data.country_name;
    req.body.region = data.region_name;
    req.body.city = data.city_name;

    //---   Save the Data
    let scan = await ScanModel.create(req.body);

    //---   Redirected to that website
    res.redirect(qr.Url);

    //-----------------Saving Scan-------------------------//
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    //------------------Validation Error-------------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
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
      const os = item.Os;

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
      const Browser = item.DeviceName;
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
      state: citycode,
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
  ScanQr,
  getAnalytics,
};
