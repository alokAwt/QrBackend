const AppErr = require("../Global/AppErr");
const verifyToken = require("../Global/VerifyToken");
const UserModel = require("../Modal/User");


const IsLogin = async (req, res, next) => {
  let decoded = verifyToken(req.headers.token);
  req.user = decoded.id;
  if (!decoded) {
    return next(new AppErr("Invailed Token/Expired Token ", 404));
  }
  let userFound = await UserModel.findById(decoded.id);
  if (!userFound) {
    return next(new AppErr("Invailed Token/Expired Token ", 404));
  }
  next();
};

module.exports = IsLogin;
