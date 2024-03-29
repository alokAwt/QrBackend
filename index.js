const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
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
const requestIp = require('request-ip');
const app = express();
Db();
require("dotenv").config();

//-----------------MiddleWare-------------------------//
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(requestIp.mw());

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
app.use("/api/v1/Suscription",SuscriptionRouter)

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
