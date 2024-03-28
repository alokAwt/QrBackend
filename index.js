const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
var Fingerprint = require("express-fingerprint");
const cloudinary = require("cloudinary").v2;
const Db = require("./Config/DbConnection");
const UserRouter = require("./Route/User");
const globalErrHandler = require("./Middleware/GlobalError");
const WebsiteRouter = require("./Route/QR/WebsiteUrl");
const ScanRouter = require("./Route/Scanqr");
const SocialMediaRouter = require("./Route/QR/SocialMedia");
const PlayStoreRouter = require("./Route/QR/PlayStore");
const DocumentRouter = require("./Route/QR/Document");
const AudioRouter = require("./Route/QR/Audio");
const ImageRouter = require("./Route/QR/Image");
const VideoRouter = require("./Route/QR/Video");
const GooglemapRouter = require("./Route/QR/GoogleMap");
const SuscriptionRouter = require("./Route/Subscription");
const SuscriptionPlanRouter = require("./Route/SubscriptionPlan");
const requestIp = require("request-ip");
const ContactRouter = require("./Route/ContactUs");
const GameRouter = require("./Route/Gamification");
const TextRouter = require("./Route/QR/Text");
const app = express();
Db();
require("dotenv").config();

//-----------------MiddleWare-------------------------//
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(requestIp.mw());
app.use(
  Fingerprint({ parameters: [Fingerprint.useragent, Fingerprint.geoip] })
);
cloudinary.config({
  cloud_name: "dxlmwq61j",
  api_key: "449172957755657",
  api_secret: "_svozk1NVYoC0NWVSoV-fhR-j5c",
});

//------------------Routes MiddleWare---------------------//
app.use("/api/v1/Users", UserRouter);
app.use("/api/v1/Scan", ScanRouter);
app.use("/api/v1/Qr", WebsiteRouter);
app.use("/api/v1/socialmedia", SocialMediaRouter);
app.use("/api/v1/PlayStore", PlayStoreRouter);
app.use("/api/v1/document", DocumentRouter);
app.use("/api/v1/audioQr", AudioRouter);
app.use("/api/v1/ImageQr", ImageRouter);
app.use("/api/v1/VideoQr", VideoRouter);
app.use("/api/v1/Map", GooglemapRouter);
app.use("/api/v1/Suscription", SuscriptionRouter);
app.use("/api/v1/Plan", SuscriptionPlanRouter);
app.use("/api/v1/contact", ContactRouter);
app.use("/api/v1/Gamification", GameRouter);
app.use("/api/v1/Text", TextRouter);

app.use(globalErrHandler);

//----------------Server Listening--------------------------//
const PORT = process.env.PORT || 3000;
const Applisten = () => {
  //------------Database Call------------//
  app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
  });
};
Applisten();
