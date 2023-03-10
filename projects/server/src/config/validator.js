const { check, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      //Validation proses
      if (req.body.regis != "firebase") {
        await check("email").notEmpty().isEmail().run(req);
        await check("password")
          .notEmpty()
          .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
          })
          .run(req);

        const validation = validationResult(req);
        console.log(validation);
        if (validation.isEmpty()) {
          next();
        } else {
          return res.status(400).send({
            success: false,
            message: "Validation invalid❌",
            error: validation.errors,
          });
        }
      } else {
        next();
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  },
};
