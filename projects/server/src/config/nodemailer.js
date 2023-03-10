const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "purwadhikarenthaven@gmail.com",
    pass: "jwazrbgdaorepmwq",
  },
});

module.exports = {
  transport,
};
