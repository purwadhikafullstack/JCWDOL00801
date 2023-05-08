const { reviewModel, userModel } = require("../model");
const { Op } = require("sequelize");

module.exports = {
  checkReview: async (req, res) => {
    try {
      const data = await reviewModel.findAll({
        where: { transactionId: req.query.id },
      });
      return res.status(200).send({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  reviewTesti: async (req, res) => {
    try {
      const data = await reviewModel.findAll({
        include: {
          model: userModel,
          as: "user",
          required: true,
        },
        limit: 3,
      });
      return res.status(200).send({
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
