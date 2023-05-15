const {
  categoryModel,
  orderListModel,
  transactionModel,
  roomModel,
  propertyModel,
} = require("../model");
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
  getDataForCreate: async (req, res) => {
    try {
      const data = await categoryModel.findAll({
        where: { [Op.and]: [{ tenantId: req.params.tenantId }, { isDeleted: false }] },
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
  editData: async (req, res) => {
    try {
      const { province, city, categoryId, tenantId } = req.body;
      const checkData = await propertyModel.findAll({
        include: {
          model: categoryModel,
          as: "category",
          required: true,
          where: { city },
        },
        where: { tenantId },
      });
      if (checkData.length > 0) {
        return res.status(500).send({
          success: false,
          message: "City already exists",
        });
      }
      const update = await categoryModel.update(
        {
          province,
          city,
        },
        {
          where: { categoryId },
        }
      );
      if (update) {
        return res.status(200).send({
          success: true,
          message: `Category has been updated`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  delete: async (req, res) => {
    try {
      const { isDeleted, categoryId, tenantId } = req.body;
      const checkStatus = await orderListModel.findAll({
        include: [
          {
            model: transactionModel,
            as: "transaction",
            required: true,
            where: {
              [Op.or]: [{ status: "Waiting for payment" }, { status: "Waiting for confirmation" }],
            },
          },
          {
            model: roomModel,
            as: "room",
            required: true,
            include: {
              model: propertyModel,
              as: "property",
              required: true,
              where: { [Op.and]: [{ tenantId }, { categoryId }] },
            },
          },
        ],
      });
      if (checkStatus.length > 0) {
        return res.status(400).send({
          result: checkStatus,
          success: false,
          message: `Can not deactivate this category because there are ongoing transaction(s)`,
        });
      } else {
        if (!isDeleted) {
          // kalo mau diaktifkan
          const updateCategory = await categoryModel.update(
            {
              isDeleted,
            },
            {
              where: { categoryId },
            }
          );
          if (updateCategory) {
            return res.status(200).send({
              success: true,
              message: `Category has been updated`,
            });
          }
        }

        const findProperty = await propertyModel.findAll({
          where: { categoryId },
        });

        if (findProperty.length > 0) {
          findProperty.forEach(async (property) => {
            const updateRoom = await roomModel.update(
              { isDeleted },
              {
                where: {
                  propertyId: property.propertyId,
                },
              }
            );
          });
        }

        const updateProperty = await propertyModel.update(
          {
            isDeleted,
          },
          {
            where: { [Op.and]: [{ tenantId }, { categoryId }] },
          }
        );

        const updateCategory = await categoryModel.update(
          {
            isDeleted,
          },
          {
            where: { categoryId },
          }
        );
        if (updateCategory) {
          return res.status(200).send({
            success: true,
            message: `Category has been updated`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
