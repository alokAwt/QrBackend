const QRCode = require("qrcode");

const GenerateQr = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(data);
    return `${qrCode}`;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return error.message;
  }
};

module.exports = GenerateQr;
