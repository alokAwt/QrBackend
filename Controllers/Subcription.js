const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const Razorpay = require("razorpay");
const crypto=require("crypto");
const UserModel = require("../Modal/User");
const SubcriptionModel = require("../Modal/Subscription");
const KEY_ID = "rzp_test_MtraH0q566XjUb";
const KEY_SECRET = "W7kdpNZq9scZ30kTfNA3szfD";

const CreateOrder = async (req, res, next) => {
  try {
    //-----Checking Validation-----------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    //------------Chcek User------------//
    let user = await UserModel.findById(req.user);
    if (!user) {
      return next(new AppErr("User not found", 404));
    }

    //--------Creating Order--------------//
    let instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
    var options = {
      amount: req.body.Price, // amount in the smallest currency unit
      currency: "INR",
    };
    instance.orders.create(options, (err, order) => {
      if (err) {
        return next(new AppErr(err, 401));
      }

      return res.status(200).json({
        status: "success",
        data: order,
      });
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

const PayAmount = async (req, res, next) => {
  try {
    //----------Validation error---------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }
    let user = await UserModel.findById(req.user).populate("subscription");
    if (!user) {
      return next(new AppErr("User not Found", 500));
    }
    if (user.subscription) {
      var Difference_In_Time =
        new Date().getTime() -
        new Date(user.subscription[0].lastDate).getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      if (Difference_In_Days >= 0) {
        //--------When subscription is finished---------------//
        let last_date = new Date();
        last_date.setDate(last_date.getDate() + 30);
        req.body.lastDate = last_date;
      } else {
        //--------When subscription is remaining---------------//
        let last_date = new Date(user.subscription[0].lastDate);
        last_date.setDate(last_date.getDate() + 30);
        req.body.lastDate = last_date;
      }
    } else {
      let last_date = new Date();
      last_date.setDate(last_date.getDate() + 30);
      req.body.lastDate = last_date;
    }

    //----------Getting User Data------------------//
    let { response, PlanType } = req.body;
    let body = response.razorpay_order_id + "|" + response.razorpay_payment_id;

    //-----------Validating Signatire-----------//

    var expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === response.razorpay_signature) {
      //----------Saving Payment-----------//
      req.body.UserId = req.user;
      req.body.orderId = response.razorpay_order_id;
      req.body.TransitionId = response.razorpay_payment_id;
      let pay = await SubcriptionModel.create(req.body);

      //----------updating user Account------//
      user.subscription = [];
      user.subscription.push(pay._id);
      await user.save();

      return res.status(200).json({
        status: "success",
        data: pay,
      });
    } else {
      return next(new AppErr("Invalid Signature", 404));
    }
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//-----------------Get All My Subscriptions---------------------//
const getAllSubscriptions = async (req, res, next) => {
  try {
    //----------Validation error---------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let result = await SubcriptionModel.find({ UserId: req.user });
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//-----------------Get All My Subscriptions---------------------//
const getAllSubscriptionsByAdmin = async (req, res, next) => {
  try {
    //----------Validation error---------------//
    let err = validationResult(req);
    if (!err.isEmpty()) {
      return next(new AppErr(err.errors[0].msg, 403));
    }

    let result = await SubcriptionModel.find();
    return res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

module.exports = {
  CreateOrder,
  PayAmount,
  getAllSubscriptions,
  getAllSubscriptionsByAdmin,
};
