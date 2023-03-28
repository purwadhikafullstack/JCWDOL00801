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
      let newStartDate = req.body.startDate.toString().slice(0, -1).slice(0, 19).replace('T', ' ')
      let newEndDate = req.body.endDate.toString().slice(0, -1).slice(0, 19).replace('T', ' ')
      const data = await dbSequelize.query(`SELECT 
      MIN(t.price) AS price, 
      p.name, 
      c.city, 
      p.propertyId AS id, 
      MIN(t.typeId) AS typeId,
      r.roomId
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
              STR_TO_DATE("${newStartDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate 
              OR STR_TO_DATE("${newEndDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate
              AND (
                DATE_FORMAT(STR_TO_DATE("${newStartDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                AND TIME_FORMAT("${newStartDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                OR TIME_FORMAT("${newStartDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')
              )
              AND (
                DATE_FORMAT(STR_TO_DATE("${newEndDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                AND TIME_FORMAT("${newEndDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                OR TIME_FORMAT("${newEndDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')
              )
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
    let newStartDate = req.body.startDate.toString().slice(0, -1).slice(0, 19).replace('T', ' ')
    let newEndDate = req.body.endDate.toString().slice(0, -1).slice(0, 19).replace('T', ' ')
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
      r.roomId NOT IN(
              SELECT ra.roomId 
              FROM roomavailabilities AS ra
              WHERE 
                STR_TO_DATE("${newStartDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate 
                OR STR_TO_DATE("${newEndDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate
                AND (
                  DATE_FORMAT(STR_TO_DATE("${newStartDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                  AND TIME_FORMAT("${newStartDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                  OR TIME_FORMAT("${newStartDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')
                )
                AND (
                  DATE_FORMAT(STR_TO_DATE("${newEndDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                  AND TIME_FORMAT("${newEndDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                  OR TIME_FORMAT("${newEndDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')   
            )
            );
`, {
        type: QueryTypes.SELECT
      })
      const roomNotAvail = await dbSequelize.query(`
      SELECT * 
      FROM rooms AS r 
      INNER JOIN properties AS p ON r.propertyId = p.propertyId 
      WHERE p.propertyId = ${property.propertyId} AND
      r.roomId IN(
              SELECT ra.roomId 
              FROM roomavailabilities AS ra
              WHERE 
                STR_TO_DATE("${newStartDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate 
                OR STR_TO_DATE("${newEndDate}", '%Y-%m-%d %H:%i:%s') BETWEEN ra.startDate AND ra.endDate
                AND (
                  DATE_FORMAT(STR_TO_DATE("${newStartDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                  AND TIME_FORMAT("${newStartDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                  OR TIME_FORMAT("${newStartDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')
                )
                AND (
                  DATE_FORMAT(STR_TO_DATE("${newEndDate}", '%Y-%m-%d %H:%i:%s'), '%Y-%m-%d') = DATE_FORMAT(ra.startDate, '%Y-%m-%d') 
                  AND TIME_FORMAT("${newEndDate}", '%H:%i:%s') >= TIME_FORMAT(ra.endDate, '%H:%i:%s') 
                  OR TIME_FORMAT("${newEndDate}", '%H:%i:%s') <= TIME_FORMAT(ra.startDate, '%H:%i:%s')   
            )
            );
`, {
        type: QueryTypes.SELECT
      })
      console.log("ROOM NOT AVAIL =>", roomNotAvail)
      if (roomAvail.length > 0) {
        let notAvail = roomAvail.map(val => (["t.typeId != " + val.typeId]))
        let bookedRooms = roomAvail.map((val) => ({
          typeId: val.typeId
        }))
        console.log("BOOKED", bookedRooms)
        let type = await typeModel.findAll({
          where: {
            [Op.or]: bookedRooms
          },
          order: ["price"],
        });
        console.log(type)
        if (notAvail.length > 0) {
          let notAvailRooms = await dbSequelize.query(`select t.typeId, t.name, t.price, t.desc, t.capacity, t.typeImg from types as t INNER JOIN rooms as r on t.typeId = r.typeId INNER JOIN properties as p on r.propertyId = p.propertyId 
          where p.propertyId = ${property.propertyId} AND ${notAvail.join(" AND ")} GROUP BY t.typeId ORDER BY t.price;`, {
            type: QueryTypes.SELECT
          })
          console.log("CURRENT", notAvailRooms)
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
      let notAvail = roomAvail.map(val => (["t.typeId != " + val.typeId]))
      let bookedRooms = roomAvail.map((val) => ({
        typeId: val.typeId
      }))
      console.log("BOOKED", bookedRooms)
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
      console.log("CURRENT", notAvailRooms)
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
}