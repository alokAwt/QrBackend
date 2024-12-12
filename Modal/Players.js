const mongoose = require("mongoose");

const PlayersSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Email: {
    type: String,
  },
  Number: {
    type: String,
  },
  Address: {
    type: String,
  },
  GameId: {
    type: String,
  },
  WinnerStatus: {
    type: Boolean,
    required: true,
  },
  WinningDetails: {
    Name: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      require: true,
    },
    position: {
      type: String,
      require: true,
    },
    WinningId: {
      type: String,
    },
  },
});

const PlayersModel = mongoose.model("Players", PlayersSchema);
module.exports = PlayersModel;
