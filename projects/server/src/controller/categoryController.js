const { categoryModel } = require("../model");
const { Op } = require("sequelize");

module.exports = {
  regis: async (req, res) => {
    try {
      const { tenantId, city } = req.body;
      const check = await categoryModel.findAll({
        where: {
          [Op.and]: [
            { tenantId: tenantId },
            {
              city: city,
            },
          ],
        },
      });
      if (check.length > 0) {
        return res.status(500).send({
          success: false,
          message: "City Already Added",
        });
      } else {
        const data = await categoryModel.create(req.body);
        return res.status(200).send({
          success: true,
          message: "New Category Added",
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getData: async (req, res) => {
    try {
      const data = await categoryModel.findAll({
        where: { tenantId: req.params.tenantId },
        order: ["province"],
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getAllData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;

      const { search, sortby } = req.query;
      const order = req.query.order || "asc";
      const filterData = [{ tenantId: req.query.tenant }];
      const sortData = [];
      if (search) {
        filterData.push({
          [Op.or]: [
            {
              province: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        });
      }
      if (sortby) {
        sortData.push([sortby, order]);
      } else {
        sortData.push(["categoryId", "DESC"]);
      }

      const data = await categoryModel.findAndCountAll({
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
