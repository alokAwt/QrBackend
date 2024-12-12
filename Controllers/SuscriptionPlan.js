const { validationResult } = require("express-validator");
const AppErr = require("../Global/AppErr");
const SubcriptionPlanModel = require("../Modal/SubscriptionPlan");

//-----------CreatePlan--------------------//

const CreatePlan = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }
    const planstype = ["Basic", "Standared", "Pro"];
    let { PlanType, Price, Duration, Discount } = req.body;

    let found = planstype.find((item) => item === PlanType);
    if (!found) {
      return next(
        new AppErr("Plan Type should be 'Basic' or 'Standared' or 'Pro'")
      );
    }
    //--------CheckExisting Plan-----------------//
    let plan = await SubcriptionPlanModel.find({ PlanType: PlanType });
    if (plan.length > 0) {
      return next(new AppErr(`${PlanType} is already available`, 403));
    }

    //--------Creating Plan----------------//
    let newplan = await SubcriptionPlanModel.create(req.body);

    return res.status(200).json({
      status: "success",
      data: newplan,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

//----------------------UpdatePlan---------------------------//

const UpdatePlan = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    const planstype = ["Basic", "Standared", "Pro"];
    let { PlanType, Price, Duration, Discount } = req.body;

    let found = planstype.find((item) => item === PlanType);
    if (!found) {
      return next(
        new AppErr("Plan Type should be 'Basic' or 'Standared' or 'Pro'")
      );
    }

    //-----------------Getting Plan ------------------//
    let plan = await SubcriptionPlanModel.findById(req.params.id);
    if (!plan) {
      return next(new AppErr("Plan not found", 404));
    }

    //----------------UpdatePlan------------------------//
    let updatePlan = await SubcriptionPlanModel.findByIdAndUpdate(
      plan._id,
      {
        ...req.body,
      },
      { new: true }
    );

    return res.status(200).json({
      status: "success",
      data: updatePlan,
    });
  } catch (error) {
    return next(new AppErr(error.message, 404));
  }
};

//-----------------------Get AllPlan-----------------------//

const getAllPlan = async (req, res, next) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return next(new AppErr(error.errors[0].msg, 403));
    }

    let plan = await SubcriptionPlanModel.find();
    return res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    return next(new AppErr(error.message, 500));
  }
};

module.exports = {
  CreatePlan,
  UpdatePlan,
  getAllPlan,
};
