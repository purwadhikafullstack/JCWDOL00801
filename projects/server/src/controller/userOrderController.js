const {
  orderListModel,
  transactionModel,
  roomModel,
  propertyModel,
  userModel,
  typeModel,
  tenantModel,
} = require("../model");
const { Op } = require("sequelize");

module.exports = {
  getData: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: { email: req.query.email },
      });
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const offset = limit * page;
      const { sortby, startDate, endDate, orderId } = req.query;
      const order = req.query.order || "asc";
      const status = req.query.status ? { status: req.query.status } : null;
      const filterData = [];
      const sortData = [];

      if (sortby) {
        sortData.push([sortby, order]);
      } else {
        sortData.push(["orderId", "DESC"]);
      }
      if (orderId) {
        filterData.push({
          orderId,
        });
      }
      if (startDate) {
        filterData.push({
          createdAt: {
            [Op.gte]: startDate,
          },
        });
      }
      if (endDate) {
        filterData.push({
          createdAt: {
            [Op.lte]: endDate,
          },
        });
      }

      const data = await orderListModel.findAndCountAll({
        include: [
          {
            model: transactionModel,
            as: "transaction",
            required: true,
            where: { [Op.and]: [{ userId: user[0].userId }, status] },
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
                include: {
                  model: tenantModel,
                  as: "tenant",
                  require: true,
                  include: {
                    model: userModel,
                    as: "user",
                    require: true,
                  },
                },
              },
              {
                model: typeModel,
                as: "type",
                required: true,
              },
            ],
          },
        ],
        where: {
          [Op.and]: filterData,
        },
        order: sortData,
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
};
