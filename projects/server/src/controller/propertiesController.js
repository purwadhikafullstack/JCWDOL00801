const Sequelize = require("sequelize");
const { propertyModel } = require("../model");

module.exports = {
  getProperties: async (req, res) => {
    let data = await propertyModel.findAll();

    if (!data) {
      return res.status(404).send({
        success: false,
      });
    }

    return res.status(200).send({
      success: true,
      data,
    });
  },
};
