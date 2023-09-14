const nodemailer = require("nodemailer");
require("dotenv").config();

const Mail = async (receiver, pdfData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587, //465
    secure: false, //false
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
      user: "aadhillinked@gmail.com",
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const mailOptions = {
    from: process.env.USERNAME, // sender address
    to: `${receiver}`, // list of receivers
    subject: "Latest Weather Report", // Subject line
    text: "Please Download The Attachment To View The Latest Weather Report", // plain text bod y
    html: "<b>DOWNLOAD !!</b>", // html body
    attachments: [
      {
        filename: "weatherReport.pdf",
        content: pdfData,
      },
    ],
  };

  const sendMail = async (transporter, mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email has been sent Successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  sendMail(transporter, mailOptions);
};

module.exports = { Mail };
