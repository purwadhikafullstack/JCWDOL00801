const { Op } = require("sequelize");
const {
  propertyModel,
  categoryModel,
  roomModel,
  orderListModel,
  transactionModel,
} = require("../model");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  getData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;

      const { name, city, address, sortby } = req.query;
      const order = req.query.order || "asc";
      const filterData = [{ tenantId: req.query.tenant }];
      const sortData = [];
      if (name) {
        filterData.push({
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + name + "%",
              },
            },
          ],
        });
      }
      if (city) {
        filterData.push({
          categoryId: city,
        });
      }
      if (address) {
        filterData.push({
          address: {
            [Op.like]: "%" + address + "%",
          },
        });
      }
      if (sortby) {
        sortData.push([sortby, order]);
      } else {
        sortData.push(["propertyId", "DESC"]);
      }

      const data = await propertyModel.findAndCountAll({
        include: {
          model: categoryModel,
          as: "category",
          required: true,
        },
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
  create: async (req, res) => {
    try {
      await sharp(req.files[0].path)
        .resize(600, 400, { fit: "fill" })
        .toFile(path.resolve(req.files[0].destination, `RH${req.files[0].filename}`));
      fs.unlinkSync(req.files[0].path);

      const pathName = req.files[0].destination.split("/");
      const propertyImg = `/${pathName[pathName.length - 1]}/RH${req.files[0].filename}`;

      const newBody = { ...req.body, image: propertyImg };
      const checkData = await propertyModel.findAll({
        where: {
          name: req.body.name,
        },
      });
      if (checkData.length > 0) {
        return res.status(500).send({
          success: false,
          message: `Product already exist`,
        });
      } else {
        const data = await propertyModel.create(newBody);
        return res.status(200).send({
          success: true,
          message: `New Property Added`,
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    try {
      // akan ditambahkan ketika fitur transaksi sudah di merge
      // const check = await orderListModel.findAll({
      //   include: [
      //     {
      //       model: transactionModel,
      //       as: "transaction",
      //       required: true,
      //       where: {
      //         [Op.and]: [{ status: "Waiting for payment" }, { status: "Waiting for confirmation" }],
      //       },
      //     },
      //     {
      //       model: roomModel,
      //       as: "room",
      //       required: true,
      //       include: {
      //         model: propertyModel,
      //         as: "property",
      //         required: true,
      //         where: {
      //           propertyId: req.params.propertyId,
      //         },
      //       },
      //     },
      //   ],
      // });
      let update = await propertyModel.update(req.body, {
        where: {
          propertyId: req.params.propertyId,
        },
      });
      if (update) {
        return res.status(200).send({
          success: true,
          message: `Data Updated Successfully`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getEditData: async (req, res) => {
    try {
      const data = await propertyModel.findAll({
        include: {
          model: categoryModel,
          as: "category",
          required: true,
        },
        where: {
          propertyId: req.params.propertyId,
        },
      });
      return res.status(200).send(data[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  updateEditData: async (req, res) => {
    try {
      const { propertyId, name, desc, phone, categoryId, address } = req.body;
      if (!req.files[0]) {
        req.files[0] = {
          filename: "",
        };
      } else if (!req.body.filename) {
        req.body.filename == "";
      }

      let propertyPicture =
        req.files[0].filename === ""
          ? `${req.body.filename}`
          : `/propertyImg/${req.files[0].filename}`;
      let update = await propertyModel.update(
        {
          propertyId,
          categoryId,
          name,
          phone,
          address,
          desc,
          image: propertyPicture,
        },
        {
          where: {
            propertyId: req.body.propertyId,
          },
        }
      );
      if (update) {
        return res.status(200).send({
          success: true,
          message: `Property Data Updated Successfully`,
          picture: propertyPicture,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
