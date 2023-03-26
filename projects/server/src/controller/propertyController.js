const {
  userModel,
  propertyModel,
  roomModel,
  typeModel,
  roomAvailModel,
  categoryModel,
  tenantModel
} = require("../model");
const bcrypt = require("bcrypt");
const {
  dbSequelize
} = require("../config/db");
const {
  QueryTypes,
  Op
} = require("sequelize");

module.exports = {
  getPropertyData: async (req, res) => {
    try {
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      const data = await dbSequelize.query(`SELECT MIN(t.price) AS price, p.name, c.city, p.propertyId AS id , t.typeId
      FROM rooms AS r 
      INNER JOIN properties AS p ON r.propertyId = p.propertyId 
      INNER JOIN types AS t ON r.typeId = t.typeId
      INNER JOIN categories AS c ON p.categoryId = c.categoryId 
      WHERE r.roomId NOT IN (
        SELECT ra.roomId 
        FROM roomavailabilities AS ra 
        WHERE ra.startDate <= "${(new Date(new Date(req.body.endDate) - tzoffset)).toISOString().slice(0, -1).slice(0, 19).replace('T', ' ')}" 
        AND ra.endDate >= "${(new Date(new Date(req.body.startDate) - tzoffset)).toISOString().slice(0, -1).slice(0, 19).replace('T', ' ')}"
      )
      GROUP BY p.name, c.city, p.propertyId;`, {
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
      let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let roomAvail = await dbSequelize.query(`
      SELECT * 
      FROM rooms AS r 
      INNER JOIN properties AS p ON r.propertyId = p.propertyId 
      WHERE p.propertyId = ${property.propertyId} 
        AND r.roomId NOT IN (
            SELECT ra.roomId
            FROM roomavailabilities AS ra
            WHERE (
                ra.startDate <= '${(new Date(new Date(req.body.startDate) - tzoffset)).toISOString().slice(0, -1).slice(0, 19).replace('T', ' ')} '
                AND ra.endDate >= '${(new Date(new Date(req.body.endDate) - tzoffset)).toISOString().slice(0, -1).slice(0, 19).replace('T', ' ')}'
            )
        );
`, {
        type: QueryTypes.SELECT
      })
    
      if (roomAvail.length > 0) {
        let bookedRooms = roomAvail.map((val) => ({typeId: val.typeId}))
        let type = await typeModel.findAll({
          where: {
            [Op.or]: bookedRooms
          },
        });
        console.log(type)
        // console.log("bookedRooms ->", bookedRooms);
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
      // console.log("filteredType", filteredType);
      // console.log("roomArr ->", roomArr);

      let type = await typeModel.findAll({
        where: {
          [Op.or]: filteredType
        },
      });



      // let startDate = new Date();
      // let endDate = new Date();

      return res.status(200).send({
        success: true,
        property,
        room,
        type,
        roomAvail,
        category,
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
}