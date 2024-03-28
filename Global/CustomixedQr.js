const { QRCodeCanvas } = require("@loskir/styled-qr-code-node");

const GenerateCustomizeQr = async (
  data,
  dotoption,
  backgroundOption,
  cornersOptions,
  cornersDotOptions,
  image
) => {
  const qrCode = new QRCodeCanvas({
    width: 250,
    height: 250,
    type: "png",
    data: data,
    image: image.length > 0 ? image : undefined,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      crossOrigin: "anonymous",
    },
    dotsOptions: dotoption,
    backgroundOptions: {
      color: "rgba(255,255,255,1)",
    },
    cornersDotOptions: cornersDotOptions,
    cornersSquareOptions: cornersOptions,
  });

  try {
    const dataUrl = await qrCode.toDataUrl();
    return dataUrl;
  } catch (error) {
    return error;
  }
};

module.exports = GenerateCustomizeQr;
