const {
  orderListModel,
  transactionModel,
  roomModel,
  propertyModel,
  userModel,
  typeModel,
} = require("../model");
const { Op } = require("sequelize");

module.exports = {
  getData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;
      const status = req.query.status ? { status: req.query.status } : null;
      const filterProperty = [{ tenantId: req.query.tenant }];
      if (req.query.property) {
        filterProperty.push({ name: { [Op.like]: "%" + req.query.property + "%" } });
      }
      const filterOrderId = req.query.orderId ? { orderId: req.query.orderId } : null;
      const data = await orderListModel.findAndCountAll({
        include: [
          {
            model: transactionModel,
            as: "transaction",
            required: true,
            include: {
              model: userModel,
              as: "user",
              required: true,
            },
            where: status,
          },
          {
            model: roomModel,
            as: "room",
            required: true,
            include: [
              {
                model: propertyModel,
                as: "property",
                required: true,
                where: { [Op.and]: filterProperty },
              },
              {
                model: typeModel,
                as: "type",
                required: true,
              },
            ],
          },
        ],
        where: filterOrderId,
        order: [["transaction", "status", "DESC"]],
        offset: offset,
        limit: limit,
      });
      const totalPage = Math.ceil(data.count / limit);
      if (data.count > 0) {
        return res.status(200).send({
          data: data.rows,
          page,
          limit,
          totalRows: data.count,
          totalPage,
        });
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    try {
      const update = await transactionModel.update(
        {
          status: req.body.status,
        },
        {
          where: { transactionId: req.body.transactionId },
        }
      );
      if (update) {
        return res.status(200).send({
          success: true,
          message: `Order has been updated`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
