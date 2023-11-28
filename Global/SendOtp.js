const nodemailer = require("nodemailer");

const SendEmail = async (email, otp) => {
  const mailOptions = {
    from: "easypeasy11746@gmail.com",
    to: email,
    subject: new Date(),
    html: `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                margin: 0;
                padding: 0;
            }
            .container {
                background-color: #ffffff;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            h1 {
                color: #333;
                text-align: center;
            }
            .otp {
                font-size: 36px;
                font-weight: bold;
                text-align: center;
                color: #0077B6;
            }
            p {
                color: #444;
                text-align: center;
            }
            .cta-button {
                background-color: #0077B6;
                border: none;
                color: #ffffff;
                padding: 12px 24px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 20px auto;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>OTP Verification</h1>
            <p>Your One-Time Password (OTP) is:</p>
            <p class="otp">${otp}</p>
            <p>This OTP is valid for a short period of time. Please do not share it with anyone.</p>
            <p>If you didn't request this OTP, please ignore this message.</p>
            <p>Thank you for using our service!</p>
            <a class="cta-button" href="#">Verify Now</a>
        </div>
    </body>
    </html>
    `,
  };

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "easypeasy11746@gmail.com",
        pass: "eyqunwdhrpkbzvwg",
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error); // Reject the Promise in case of an error
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info); // Resolve the Promise with the result in case of success
      }
    });
  });

};

module.exports = SendEmail;
