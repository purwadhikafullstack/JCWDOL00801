const {
  userModel,
  propertyModel,
  roomModel,
  typeModel,
  roomAvailModel,
  categoryModel,
  tenantModel,
  orderListModel,
  transactionModel,
} = require("../model");
const bcrypt = require("bcrypt");
const {
  dbSequelize
} = require("../config/db");
const {
  QueryTypes,
  Op
} = require("sequelize");
const moment = require("moment-timezone")

module.exports = {
  getPropertyData: async (req, res) => {
    try {
      let newStartDate = new Date(req.body.startDate);
      let newEndDate = new Date(req.body.endDate);
      console.log("NEWDATE",newEndDate)
      console.log(newStartDate)
      const data = await dbSequelize.query(`SELECT 
      MIN(t.price) AS price, 
      p.name, 
      c.city, 
      p.propertyId AS id, 
      r.roomId,
      t.typeId
    FROM 
      properties AS p 
      INNER JOIN categories AS c ON p.categoryId = c.categoryId
      INNER JOIN (
        SELECT 
          r.propertyId, 
          MIN(t.price) AS min_price
        FROM 
          rooms AS r 
          INNER JOIN types AS t ON r.typeId = t.typeId
        WHERE 
          r.roomId NOT IN (
            SELECT ra.roomId 
            FROM roomavailabilities AS ra
            WHERE 
            ${dbSequelize.escape(newStartDate)} BETWEEN ra.startDate AND ra.endDate 
            OR ${dbSequelize.escape(newEndDate)} BETWEEN ra.startDate AND ra.endDate
            )
        GROUP BY 
          r.propertyId
      ) AS min_prices ON p.propertyId = min_prices.propertyId 
      INNER JOIN rooms AS r ON min_prices.propertyId = r.propertyId
        AND min_prices.min_price = (
          SELECT MIN(t.price) 
          FROM types AS t 
          WHERE t.typeId = r.typeId
        )
      INNER JOIN types AS t ON r.typeId = t.typeId
    GROUP BY 
      p.propertyId, 
      p.name, 
      c.city
    ORDER BY 
      price;`, {
        type: QueryTypes.SELECT
      });
      return res.status(200).send({
        success: true,
        result: data
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        success: false,
        message: "Database Error"
      })
    }
  },
  getProperties: async (req, res) => {
    const {
      id
    } = req.params;
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
    try {
      let property = await propertyModel.findOne({
        where: {
          [Op.and]: [{
            propertyId: id
          }, {
            isDeleted: 0
          }]
        }
      });

      if (!property) {
        return res.status(404).send({
          success: false,
          message: "Property not found",
        });
      }
      const tenant = await tenantModel.findOne({
        where: {
          tenantId: property.tenantId
        }
      })
      const userTenant = await userModel.findOne({
        where: {
          userId: tenant.userId
        }
      })
      const category = await categoryModel.findOne({
        where: {
          categoryId: property.categoryId
        }
      })
      let room = await roomModel.findAll({
        where: {
          propertyId: id
        }
      });

      let roomArr = room.map(val => ({
        typeId: val.typeId
      }));
      let filteredType = roomArr.filter((val, index, self) => {
        return index === self.findIndex((t) => t.typeId === val.typeId);
      });
      let roomAvail = await dbSequelize.query(`
      SELECT * 
      FROM rooms AS r 
      INNER JOIN properties AS p ON r.propertyId = p.propertyId 
      WHERE p.propertyId = ${property.propertyId} AND
      r.roomId NOT IN (
        SELECT ra.roomId 
        FROM roomavailabilities AS ra
        WHERE 
        ${dbSequelize.escape(startDate)} BETWEEN ra.startDate AND ra.endDate 
        OR ${dbSequelize.escape(endDate)} BETWEEN ra.startDate AND ra.endDate
        )
`, {
        type: QueryTypes.SELECT
      })
      const roomNotAvail = await dbSequelize.query(`
      SELECT * 
      FROM rooms AS r 
      INNER JOIN properties AS p ON r.propertyId = p.propertyId 
      WHERE p.propertyId = ${property.propertyId} AND
      r.roomId NOT IN (
        SELECT ra.roomId 
        FROM roomavailabilities AS ra
        WHERE 
        ${dbSequelize.escape(startDate)} BETWEEN ra.startDate AND ra.endDate 
        AND ${dbSequelize.escape(endDate)} BETWEEN ra.startDate AND ra.endDate
        )

`, {
        type: QueryTypes.SELECT
      })
      if (roomAvail.length > 0) {
        let notAvail = roomAvail.map(val => (["t.typeId != " + val.typeId]))
        let bookedRooms = roomAvail.map((val) => ({
          typeId: val.typeId
        }))
        let type = await typeModel.findAll({
          where: {
            [Op.or]: bookedRooms
          },
          order: ["price"],
        });
        if (notAvail.length > 0) {
          let notAvailRooms = await dbSequelize.query(`select t.typeId, t.name, t.price, t.desc, t.capacity, t.typeImg from types as t INNER JOIN rooms as r on t.typeId = r.typeId INNER JOIN properties as p on r.propertyId = p.propertyId 
          where p.propertyId = ${property.propertyId} AND ${notAvail.join(" AND ")} GROUP BY t.typeId ORDER BY t.price;`, {
            type: QueryTypes.SELECT
          })
          return res.status(200).send({
            success: true,
            message: "roomAvail.length > 0",
            property,
            room,
            type,
            roomAvail,
            category,
            notAvailRooms,
            tenant,
            userTenant
          });
        }

        return res.status(200).send({
          success: true,
          message: "roomAvail.length > 0",
          property,
          room,
          type,
          roomAvail,
          category,
          tenant,
          userTenant
        });
      }
      let notAvail = roomAvail.map(val => (["t.typeId != " + val.typeId]))
      let bookedRooms = roomAvail.map((val) => ({
        typeId: val.typeId
      }))
      let type = await typeModel.findAll({
        where: {
          [Op.or]: bookedRooms
        },
        order: ["price"],
      });
      let notAvailRooms = await dbSequelize.query(`select t.typeId, t.name, t.price, t.desc, t.capacity, t.typeImg from types as t INNER JOIN rooms as r on t.typeId = r.typeId INNER JOIN properties as p on r.propertyId = p.propertyId 
          where p.propertyId = ${property.propertyId} ${notAvail.length > 0 ? " AND " : ""} ${notAvail.join(" AND ")} GROUP BY t.typeId ORDER BY t.price;`, {
        type: QueryTypes.SELECT
      })
      return res.status(200).send({
        success: true,
        message: "roomAvail.length > 0",
        property,
        room,
        type,
        roomAvail,
        category,
        notAvailRooms,
        tenant,
        userTenant
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "There's an error occurred on the server",
      });
    }
  },
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
      const pathName = req.files[0].destination.split("/");
      const propertyImg = `/${pathName[pathName.length - 1]}/${req.files[0].filename}`;

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
}