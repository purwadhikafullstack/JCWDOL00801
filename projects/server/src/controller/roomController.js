const { Op, QueryTypes } = require("sequelize");
const { dbSequelize } = require("../config/db");
const {
  propertyModel,
  roomModel,
  tenantModel,
  userModel,
  categoryModel,
  typeModel,
  orderListModel,
  transactionModel,
} = require("../model");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = {
  getRoomData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 5;
      const offset = limit * page;
      const { name, type, sortby, typeName, propName } = req.query;
      const order = req.query.order || "asc";
      let sortData = [];
      let filterData = [];
      let propFilterData = [];
      if (name) {
        propFilterData.push({
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + name + "%",
              },
            },
          ],
        });
      }
      if (type) {
        filterData.push({
          typeId: type,
        });
      }
      if (sortby == "name" || sortby == "price") {
        sortData.push(["type", sortby, order.toUpperCase()]);
      } else {
        sortData.push(["roomId", "DESC"]);
      }
      const data = await roomModel.findAndCountAll({
        include: [
          {
            model: propertyModel,
            as: "property",
            required: true,
            where: {
              [Op.and]: [...propFilterData, { tenantId: req.query.tenant }],
            },
          },
          {
            model: typeModel,
            as: "type",
            where: filterData,
          },
        ],
        order: sortData,
        offset: offset,
        limit: limit,
      });
      const rooms = await roomModel.findAll({
        include: [
          {
            model: propertyModel,
            as: "property",
            required: true,
            where: {
              tenantId: req.query.tenant,
            },
          },
        ],
      });
      const roomArr = rooms.map((val) => ({
        typeId: val.typeId,
      }));
      const filteredType = roomArr.filter((val, index, self) => {
        return index === self.findIndex((t) => t.typeId === val.typeId);
      });
      const types = await typeModel.findAll({
        where: {
          [Op.or]: filteredType,
        },
      });
      const totalPage = Math.ceil(data.count / limit);
      if (data.count > 0) {
        return res.status(200).send({
          data: data.rows,
          page,
          types,
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
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  getTypeRoom: async (req, res) => {
    try {
      const { id } = req.query;
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      const room = await roomModel.findAll({
        where: {
          propertyId: id,
        },
      });

      const roomArr = room.map((val) => ({
        typeId: val.typeId,
      }));
      const filteredType = roomArr.filter((val, index, self) => {
        return index === self.findIndex((t) => t.typeId === val.typeId);
      });
      const type = await typeModel.findAll({
        where: {
          [Op.or]: filteredType,
        },
      });
      return res.status(200).send({
        success: true,
        result: type,
      });
    } catch (error) {}
  },
  createRoom: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        const createRooms = await roomModel.create({
          propertyId: req.body.propertyId,
          typeId: req.body.typeId,
        });
        return res.status(200).send({
          success: true,
          message: "Room created",
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "Please login using your tenant account",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  createRoomAndType: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        await sharp(req.files[0].path)
          .resize(600, 400, {
            fit: "fill",
          })
          .toFile(path.resolve(req.files[0].destination, `RH${req.files[0].filename}`));
        fs.unlinkSync(req.files[0].path);
        const pathName = req.files[0].destination.split("/");
        const typeImg = `/typeImg/` + `RH${req.files[0].filename}`;
        const newBody = {
          ...req.body,
          typeImg,
        };
        const createType = await typeModel.create({
          name: req.body.name,
          price: req.body.price,
          desc: req.body.desc,
          typeImg: req.body.picture,
          capacity: req.body.capacity,
          typeImg: typeImg,
        });
        const createRoom = await roomModel.create({
          propertyId: req.body.propertyId,
          typeId: createType.typeId,
        });
        return res.status(200).send({
          success: true,
          message: "Room Created",
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "Please login using your tenant account",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  getCurrentRoomData: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        const rooms = await roomModel.findAll({
          where: {
            [Op.and]: [
              {
                roomId: req.body.roomId,
                isDeleted: 0 || false,
              },
            ],
          },
        });
        return res.status(200).send({
          success: true,
          result: rooms,
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "Please login using your tenant account",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  updateRoom: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        if (req.body.isTypeUpdate) {
          if (!req.files[0]) {
            req.files[0] = {
              filename: "",
            };
          } else if (!req.body.filename) {
            req.body.filename == "";
            await sharp(req.files[0].path)
              .resize(600, 400, {
                fit: "fill",
              })
              .toFile(path.resolve(req.files[0].destination, `RH${req.files[0].filename}`));
          }
          if (req.files[0].path) {
            fs.unlinkSync(req.files[0].path);
          }
          const pathName = req.files[0].filname ? req.files[0].destination.split("/") : "";
          const typeImg = req.files[0].filename ? `/typeImg/` + `RH${req.files[0].filename}` : "";
          const newBody = {
            ...req.body,
          };
          const roomPicture = req.files[0].filename === "" ? `${req.body.filename}` : typeImg;
          const type = typeModel.update(
            {
              name: req.body.name,
              price: req.body.price,
              desc: req.body.desc,
              typeImg: req.body.picture,
              capacity: req.body.capacity,
              typeImg: roomPicture,
            },
            {
              where: {
                typeId: req.body.typeId,
              },
            }
          );
        } else if (req.body.addType) {
          const createType = await typeModel.create({
            name: req.body.name,
            price: req.body.price,
            desc: req.body.desc,
            typeImg: req.body.picture,
            capacity: req.body.capacity,
            typeImg: `/typeImg/${req.files[0].filename}`,
          });
          const updatedRoom = await roomModel.update(
            {
              typeId: createType.typeId,
            },
            {
              where: {
                roomId: req.body.roomId,
              },
            }
          );
          return res.status(200).send({
            success: true,
            message: "Room updated",
          });
        }
        const updatedRoom = await roomModel.update(
          {
            typeId: req.body.typeId,
          },
          {
            where: {
              roomId: req.body.roomId,
            },
          }
        );
        return res.status(200).send({
          success: true,
          message: "Room updated",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
  checkAvailProperty: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        const availProp = await propertyModel.findAll({
          where: {
            [Op.and]: [
              {
                tenantId: tenant[0].tenantId,
                isDeleted: 0 || false,
              },
            ],
          },
        });
        if (availProp.length < 1) {
          return res.status(401).send({
            success: false,
            message: "You have not created any property yet. Try to create it?",
          });
        }
        return res.status(200).send({
          success: true,
          result: availProp,
        });
      }
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  getChosenPropertyData: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId,
        },
      });
      if (tenant.length > 0) {
        const chosenProp = await propertyModel.findOne({
          where: {
            [Op.and]: [
              {
                tenantId: tenant[0].tenantId,
                isDeleted: 0 || false,
                propertyId: req.query.id,
              },
            ],
          },
        });
        const category = await categoryModel.findOne({
          where: {
            categoryId: chosenProp.categoryId,
          },
        });
        return res.status(200).send({
          success: true,
          prop: chosenProp,
          category: category,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  getRoomType: async (req, res) => {
    try {
      const { id } = req.query;
      const room = await roomModel.findAll({
        where: {
          propertyId: id,
        },
      });

      const roomArr = room.map((val) => ({
        typeId: val.typeId,
      }));
      const filteredType = roomArr.filter((val, index, self) => {
        return index === self.findIndex((t) => t.typeId === val.typeId);
      });
      const type = await typeModel.findAll({
        where: {
          [Op.or]: filteredType,
        },
      });
      return res.status(200).send({
        success: true,
        result: type,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error",
      });
    }
  },
  getCurrentPropEdit: async (req, res) => {
    try {
      const room = await roomModel.findOne({
        where: {
          roomId: req.query.id,
        },
      });
      const property = await propertyModel.findOne({
        where: {
          propertyId: room.propertyId,
        },
      });
      const category = await categoryModel.findOne({
        where: {
          categoryId: property.categoryId,
        },
      });
      const type = await typeModel.findOne({
        where: {
          typeId: room.typeId,
        },
      });
      res.status(200).send({
        success: true,
        property: property,
        type: type,
        category,
      });
    } catch (error) {
      console.log(error),
        res.status(500).send({
          success: false,
          message: "Database Error.",
        });
    }
  },
  getCurrentTypeData: async (req, res) => {
    try {
      const { id } = req.query;
      const room = await roomModel.findOne({
        where: {
          roomId: id,
        },
      });
      const type = await typeModel.findOne({
        where: {
          typeId: room.typeId,
        },
      });
      return res.status(200).send({
        success: true,
        result: type,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  getRoomTypeData: async (req, res) => {
    try {
      const { id } = req.query;
      const type = await typeModel.findOne({
        where: {
          typeId: id,
        },
      });
      return res.status(200).send({
        success: true,
        result: type,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  update: async (req, res) => {
    try {
      // akan ditambahkan ketika fitur transaksi sudah di merge
      const check = await orderListModel.findAll({
        include: [
          {
            model: transactionModel,
            as: "transaction",
            required: true,
            where: {
              [Op.and]: [{ status: "Waiting for payment" }, { status: "Waiting for confirmation" }],
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
              where: {
                propertyId: req.body.propertyId,
              },
            },
          },
        ],
      });
      if (check.length > 0) {
        return res.status(400).send({
          result: checkStatus,
          success: false,
          message: `Can not deactivate this category because there are ongoing transaction(s)`,
        });
      }
      const checkActive = await propertyModel.findAll({
        where: {
          propertyId: req.body.propertyId
        }
      })
      if(checkActive.length > 0 && checkActive[0].isDeleted === true && req.body.isDeleted === false){
        const updates = await roomModel.update({
          isDeleted: 1
        }, {where: {
          propertyId: req.body.propertyId
        }})
        return res.status(401).send({
          success: false,
          message: "Property is deactivated, please activate it first"
        });
      }
      const update = await roomModel.update({isDeleted: req.body.isDeleted}, {
        where: {
          roomId: req.params.roomId,
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
};
