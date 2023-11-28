var jwt = require("jsonwebtoken");

const VerifyToken = (token) => {
 return jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
};

module.exports = VerifyToken;
