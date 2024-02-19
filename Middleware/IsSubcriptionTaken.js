const AppErr = require("../Global/AppErr");
const SubcriptionModel = require("../Modal/Subscription");
const UserModel = require("../Modal/User");

const Issubcription = async (req, res, next) => {
  try {
    let user = await UserModel.findById(req.user).populate("subscription");
    console.log(user);
    if (!user) {
      return next(new AppErr("User Not found", 404));
    }
    if (user.subscription) {
      var Difference_In_Time =
        new Date().getTime() -
        new Date(user.subscription[0].lastDate).getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      if (Difference_In_Days > 0) {
        return next(new AppErr("You Have Not Taken Your Subscription", 402));
      }
    } else {
      return next(new AppErr("You Have Not Taken Your Subscription", 402));
    }
    next();
  } catch (error) {}
};

module.exports = Issubcription;
