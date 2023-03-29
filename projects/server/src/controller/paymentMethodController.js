const { paymentMethodModel } = require("../model");

module.exports = {
  getData: async (req, res) => {
    try {
      const data = await paymentMethodModel.findAll({
        order: ["bankId"],
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
