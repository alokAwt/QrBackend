var jwt = require("jsonwebtoken");

const GenerateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "24d" });
};

module.exports = GenerateToken;
