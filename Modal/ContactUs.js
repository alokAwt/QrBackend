const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Subject: {
    type: String,
    required: true,
  },
  Message: {
    type: String,
    required: true,
  },
},{
    timestamps: true
});

const contactModal = mongoose.model("Contact", ContactSchema);
module.exports = contactModal;
