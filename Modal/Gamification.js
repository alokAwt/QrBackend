const mongoose = require("mongoose");

const GamificationSchema = new mongoose.Schema({
  UserId: {
    type: String,
    required: true,
  },
  deactivated: {
    type: Boolean,
    required: true,
    default: false,
  },
  GameType: {
    type: String,
    required: true,
  },
  QrImage: {
    type: String,
    required: true,
  },
  UniqueId: {
    type: String,
    required: true,
  },
  Players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
    },
  ],
  DeviceHash: [],
  Genderal: {
    CompanyName: {
      type: String,
      required: true,
    },
    CouponType: {
      type: String,
      required: true,
    },
    Couponsubtitle: {
      type: String,
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },
    PoweredByName: {
      type: String,
      required: true,
    },
    PoweredByWebsite: {
      type: String,
      required: true,
    },
    Appearsas: {
      type: String,
      required: true,
    },
    TermsAndcondition: {
      type: String,
      required: true,
    },
    Logo: {
      type: String,
      required: true,
    },
    CouponImage: {
      type: String,
      required: true,
    },
    StartDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  PrizeSetting: {
    MachineImage: {
      type: String,
      required: true,
    },
    Limitaion: {
      type: String,
      required: true,
    },
    prize: [
      {
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
      },
    ],
    winner: {
      Images: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    Losser: {
      Images: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
    RetryAfterLoss: {
      type: String,
      required: true,
    },
  },

  ClaimAction: {
    PersonalData: [],
    videoLink: {
      type: String,
      required: true,
    },
    ButtonText: {
      type: String,
      required: true,
    },
  },
  Validation: {
    PasswordValidation: {
      type: Boolean,
      required: true,
      default: false,
    },
    Password: {
      type: String,
    },
    LimitaionPerDevice: {
      type: String,
      required: true,
      default: "0",
    },
    ButtonText: {
      type: String,
      required: true,
    },
  },
});

const GamificationModel = mongoose.model("Gamification", GamificationSchema);
module.exports = GamificationModel;
