const AppErr = require("../Global/AppErr");
const VerifyToken = require("../Global/VerifyToken");
const UserModel = require("../Modal/User");

const Isblocked = async (req, res, next) => {
  let decoded = VerifyToken(req.headers.token);
  req.user = decoded.id;
  if (!decoded) {
    return next(new AppErr("Invailed Token/Expired Token ", 404));
  }
  let userFound = await UserModel.findById(decoded.id);
  console.log(userFound)
  if (userFound.isDeleted) {
    return next(new AppErr("Your Account has been Blocked", 406));
  }
  next()
};

module.exports=Isblocked
