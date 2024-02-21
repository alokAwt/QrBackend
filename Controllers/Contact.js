const { validationResult } = require("express-validator");
const contactModal = require("../Modal/ContactUs");
const AppErr = require("../Global/AppErr");

//---------------------Create Contact Us---------------------------//

const CreateContact = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    let newContact = await contactModal.create(req.body);
    return res.status(200).json({
      status: "success",
      data: newContact,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

const GetAllContactUs = async (req, res, next) => {
  try {
    let contact = await contactModal.find();
    return res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

const DeleteContact = async (req, res, next) => {
  try {
    let { id } = req.body;
    if (!id) {
      return next(new AppErr("Conatct Id is required", 404));
    }
    await contactModal.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "Contact has been deleted successfully",
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

module.exports = {
  CreateContact,
  GetAllContactUs,
  DeleteContact,
};
