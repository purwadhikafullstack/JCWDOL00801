function generateOTP() {
  let length = 4,
    charset = "0123456789",
    otp = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    otp += charset.charAt(Math.floor(Math.random() * n));
  }
  return otp;
}

module.exports = {
  generateOTP,
};
