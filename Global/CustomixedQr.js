// const { QRCodeCanvas } = require("@loskir/styled-qr-code-node");

// const GenerateCustomizeQr = async (
//   data,
//   dotoption,
//   backgroundOption,
//   cornersOptions,
//   cornersDotOptions,
//   image
// ) => {
//   const qrCode = new QRCodeCanvas({
//     data: data,
//     cellSize: 6,
//     margin: 2,
//     color: "#000000",
//     background: "#ffffff",
//     ecl: "M",
//     dotsOptions: {
//       color: dotoption.color,
//       type: dotoption.type,
//     },
//     backgroundOptions: {
//       color: "#fff",
//       type: backgroundOption.type,
//     },
//     imageOptions: {
//       crossOrigin: "anonymous",
//     },
//     cornersSquareOptions: {
//       color: cornersOptions.color,
//       type: cornersOptions.type,
//     },
//     cornersDotOptionsHelper: {
//       color: cornersDotOptions.color,
//       type: cornersDotOptions.type,
//     },
//     image: image,
//   });

//   try {
//     // Generate the QR code image as a data URL
//     const dataUrl = await qrCode.toDataUrl();
//     return dataUrl;
//   } catch (error) {
//     return error;
//   }
// };

// module.exports = GenerateCustomizeQr;
