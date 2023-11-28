const mongoose = require("mongoose");
require("dotenv").config();
const Db = () => {
  mongoose
    .connect(process.env.DATABASE)
    .then((res) => {
      console.log("Mongodb Connected Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports=Db
