const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const UserModel = require("../Modal/User");
const GenerateQr = require("../Global/GenerateQr");
const GamificationModel = require("../Modal/Gamification");
const { request } = require("express");
const PlayersModel = require("../Modal/Players");

//------------------------Create Game-------------------------------//
const CreateGamefication = async (req, res, next) => {
  try {
    //--------------Validation Error------------------//
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }
    //--------------Checking Users---------------------//
    let users = await UserModel.findById(req.user);
    if (!users) {
      return next(new AppErr("User Not Found", 404));
    }
    req.body.UserId = users._id;
    //------------Create Qr-----------------------//
    //------create a url------//
    const timestamp = new Date().getTime(); // Current timestamp
    const randomPart = Math.floor(Math.random() * 10000); // Random number (adjust as needed)
    let url = `http://localhost:9100/api/v1/Gamification/ScanGame/${timestamp}${randomPart}`;
    req.body.UniqueId = `${timestamp}${randomPart}`;
    //------Create a qr------//

    if (req.body.Validation?.Password?.length > 0) {
      req.body.Validation.PasswordValidation = true;
    }

    //------assign qr---------//
    let qr = GenerateQr(url);

    //------create collection---------//
    qr.then(async (response) => {
      req.body.QrImage = response;
      let game = await GamificationModel.create(req.body);
      users.Gamification.push(game._id);
      await users.save();
      return res.status(200).json({
        status: "success",
        data: game,
      });
    }).catch((err) => {
      return next(new AppErr(err, 404));
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//--------------Scan Qr Game----------------------------//
const ScanQrGame = async (req, res, next) => {
  try {
    let Id = req.params.id;
    if (!Id) {
      return next(new AppErr("Invailed Qr Data"), 404);
    }
    let game = await GamificationModel.findOne({ UniqueId: Id });
    if (!game) {
      return next(new AppErr("Invailed Qr Game"), 404);
    }
    if (game.deactivated) {
      return res.json({
        message: "Deactivated Qr By Owner",
      });
    }
    res.redirect(`https://qrangadi.com/playgames/${Id}`);
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//------------Check validation-----------------------//

const CheckValidation = async (req, res, next) => {
  try {
    let Id = req.params.id;
    let games = await GamificationModel.findOne({ UniqueId: Id });
    if (!games) {
      return next(new AppErr("Invailed Qr", 404));
    }
    //------------Device validation-------------//
    let allfingerprint = games.DeviceHash.filter(
      (res) => res === req.fingerprint.hash
    );
    if (allfingerprint.length >= games.Validation.LimitaionPerDevice) {
      return next(new AppErr("You Have already Played Games", 404));
    }
    //-----------Password validation------------//

    if (
      games.Validation.PasswordValidation &&
      games.Validation.Password === req.body.password &&
      req.body?.password
    ) {
      return res.status(200).json({
        status: "success",
        approved: true,
      });
    } else if (games.Validation.PasswordValidation === false) {
      return res.status(200).json({
        status: "success",
        approved: true,
      });
    } else {
      return res.status(200).json({
        status: "success",
        message: "incorrect password",
        approved: false,
      });
    }
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//-----------------Get Current Games-----------------------//

const GetYourGames = async (req, res, next) => {
  try {
    let Id = req.params.id;
    let games = await GamificationModel.findOne({ UniqueId: Id });
    if (!games) {
      return next(new AppErr("Invailed Qr", 404));
    }
    let start = new Date(games?.Genderal?.StartDate).getTime();
    let end = new Date(games?.Genderal?.endDate).getTime();
    let currentDate = new Date().getTime();
    if (currentDate >= start && currentDate <= end) {
      return res.status(200).json({
        status: "success",
        data: games,
      });
    } else {
      return next(new AppErr("Game expired! please try Next times", 404));
    }
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//--------------Save results---------------------//
const SavePlayedGames = async (req, res, next) => {
  try {
    let games = await GamificationModel.findById(req.body.Id);
    if (!games) {
      return next(new AppErr("Games not found", 404));
    }
    //------------Device validation-------------//
    let allfingerprint = games.DeviceHash.filter(
      (res) => res === req.fingerprint.hash
    );
    if (allfingerprint.length >= games.Validation.LimitaionPerDevice) {
      return next(new AppErr("You Have already Played Games", 404));
    }
    //----------------Get Winning data-----------------//
    if (req.body.WinnerStatus) {
      const timestamp = new Date().getTime();
      const randomPart = Math.floor(Math.random() * 10000);
      let winningId = `${randomPart}${timestamp}`;
      req.body.WinningDetails = {
        WinningId: winningId,
        Name: req.body.WinningDetails.Name,
        amount: req.body.WinningDetails.amount,
        position: req.body.WinningDetails.position,
      };
      req.body.GameId = games._id;
      let winner = await PlayersModel.create(req.body);
      games.Players.push(winner._id);
      games.DeviceHash.push(req.fingerprint.hash);
      await games.save();

      return res.status(200).json({
        status: "success",
        data: winner,
        message: "Congratulations  You are  Winner of the game",
      });
    } else {
      games.DeviceHash.push(req.fingerprint.hash);
      await games.save();
      return res.status(200).json({
        status: "success",
        message: "Better luck Next time",
      });
    }
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//-----------------Get My Games------------------------//
const GetOwnCreatedGames = async (req, res, next) => {
  try {
    let games = await GamificationModel.find({ UserId: req.user }).populate(
      "Players"
    );
    return res.status(200).json({
      status: "success",
      data: games,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//----------------Update My games-----------------------//
const UpdateGames = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("User not Found", 404));
    }

    let games = await GamificationModel.findById(req.params.id);
    if (!games) {
      return next(new AppErr("Game not Found", 404));
    }

    if (!user._id === games.UserId) {
      return next(new AppErr("Not Access to edit games", 404));
    }

    console.log(games._id);

    let updategames = await GamificationModel.findByIdAndUpdate(
      games._id,
      {
        $set: {
          "Validation.PasswordValidation": req.body.PasswordValidation,
          "Validation.Password": req.body.Password,
          "Validation.LimitaionPerDevice": req.body.LimitationPerDevice,
          "Genderal.StartDate": req.body.StartDate,
          "Genderal.endDate": req.body.EndDate,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: updategames,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//---------------Activate and Deactivate-----------------//
const ActivateANDdeactivate = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("User not Found", 404));
    }

    let games = await GamificationModel.findById(req.params.id);
    if (!games) {
      return next(new AppErr("Game not Found", 404));
    }

    if (!user._id === games.UserId) {
      return next(new AppErr("Not Access to edit games", 404));
    }
    let updategames = await GamificationModel.findByIdAndUpdate(
      games._id,
      {
        deactivated: req.body.action,
      },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: updategames,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};
module.exports = {
  CreateGamefication,
  ScanQrGame,
  SavePlayedGames,
  GetYourGames,
  CheckValidation,
  GetOwnCreatedGames,
  UpdateGames,
  ActivateANDdeactivate,
};
