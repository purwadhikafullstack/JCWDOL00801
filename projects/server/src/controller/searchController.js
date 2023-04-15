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
  getData: async (req, res) => {
    try {
      const page = req.query.paging ? 0 : parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 7;
      const offset = limit * page;
      const {
        startDate,
        endDate
      } = req.body;
      const newStartDate = startDate ? new Date(startDate) : new Date()
      const newEndDate = endDate ? new Date(endDate) : new Date(new Date().getTime() + 86400000)
      console.log(newStartDate, newEndDate)
      const {
        name,
        city,
        province,
        sortby,
        capacity
      } = req.query;
      const order = req.query.order || "asc";
      let filterName = "";
      let filterCity = "";
      let filterProvince = "";
      let filterCapacity = "";
      let sortData = "";
      if (name) {
        filterName += `p.name LIKE '%${name}%'`
      }
      if (province) {
        if (filterName === "" && filterCity === "") {
          filterName += `c.province = '${province}'`
        } else {
          filterName += ` AND c.province = '${province}'`
        }
      }
      if (city) {
        if (filterName === "") {
          filterCity += `c.city = '${city}'`
        } else {
          filterCity += ` AND c.city = '${city}'`
        }
      }
      if (capacity) {
        if (filterName === "" && filterCity === "" && filterProvince === "") {
          filterCapacity += `t.capacity >= '${capacity}'`
        } else {
          filterCapacity += ` AND t.capacity >= '${capacity}'`
        }
      }
      if (sortby) {
        if (sortby == "price") {
          sortData = `CASE WHEN nominal IS NOT NULL THEN nominal ELSE ${sortby} END ${order}`
        } else {
          sortData = `${sortby} ${order}`
        }

      } else {
        sortData = `CASE WHEN nominal IS NOT NULL THEN nominal ELSE price END ASC`;
      }

      const data0 = await dbSequelize.query(`SELECT 
      MIN(t.price) AS price, 
      p.name, 
      c.city, 
      p.propertyId AS id, 
      r.roomId,
      t.typeId,
      t.typeImg,
      p.desc,
      p.image,
      (SELECT sp.nominal from specialprices as sp where sp.typeId = t.typeId 
        AND ${dbSequelize.escape(newStartDate)} BETWEEN sp.startDate AND sp.endDate) AS nominal
    FROM 
      properties AS p 
      INNER JOIN categories AS c ON p.categoryId = c.categoryId
      INNER JOIN (
        SELECT 
          r.propertyId, 
          MIN(t.price) AS min_price,
          MIN(sp2.nominal) as min_nominal,
          sp2.typeId as sp_typeId
        FROM 
          rooms AS r 
          INNER JOIN types AS t ON r.typeId = t.typeId
          LEFT JOIN specialprices AS sp2 ON sp2.typeId = r.typeId AND (
            sp2.nominal IS NOT NULL 
            AND ${dbSequelize.escape(newStartDate)} BETWEEN sp2.startDate AND sp2.endDate
          )
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
      AND (
        (min_prices.min_nominal IS NOT NULL AND min_prices.min_nominal = (SELECT MIN(sp.nominal) FROM specialprices AS sp WHERE r.typeId = sp.typeId)) OR 
        (min_prices.min_nominal IS NULL AND min_prices.min_price = (SELECT MIN(t.price) FROM types AS t WHERE t.typeId = r.typeId))
      )
      INNER JOIN types AS t ON r.typeId = t.typeId
      ${name || city || province || capacity ? "WHERE" : ""} ${filterName} ${filterCity} ${filterProvince} ${filterCapacity}
    GROUP BY 
      p.propertyId, 
      p.name, 
      c.city
    ORDER BY 
      ${sortData};`, {
        type: QueryTypes.SELECT
      });
      const data = await dbSequelize.query(`SELECT 
          MIN(t.price) AS price, 
          p.name, 
          c.city, 
          p.propertyId AS id, 
          r.roomId,
          t.typeId,
          t.typeImg,
          p.desc,
          p.image,
          (SELECT sp.nominal from specialprices as sp where sp.typeId = t.typeId 
            AND (${dbSequelize.escape(newStartDate)} BETWEEN sp.startDate AND sp.endDate) AND
            (${dbSequelize.escape(newEndDate)} BETWEEN sp.startDate AND sp.endDate) ) AS nominal
        FROM 
          properties AS p 
          INNER JOIN categories AS c ON p.categoryId = c.categoryId
          INNER JOIN (
            SELECT 
              r.propertyId, 
              MIN(t.price) AS min_price,
              MIN(sp2.nominal) as min_nominal,
              sp2.typeId as sp_typeId
            FROM 
              rooms AS r 
              INNER JOIN types AS t ON r.typeId = t.typeId
              LEFT JOIN specialprices AS sp2 ON sp2.typeId = r.typeId AND (
                sp2.nominal IS NOT NULL 
                AND (${dbSequelize.escape(newStartDate)} BETWEEN sp2.startDate AND sp2.endDate) AND
                (${dbSequelize.escape(newEndDate)} BETWEEN sp2.startDate AND sp2.endDate) 
              )
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
          AND (
            (min_prices.min_nominal IS NOT NULL AND 
              (
                min_prices.min_nominal < min_prices.min_price AND
                min_prices.min_nominal = (SELECT MIN(sp.nominal) FROM specialprices AS sp WHERE r.typeId = sp.typeId)
              )
            ) OR (
              min_prices.min_nominal IS NOT NULL AND 
              (
                min_prices.min_nominal > min_prices.min_price AND
                min_prices.min_price = (SELECT MIN(t.price) FROM types AS t WHERE t.typeId = r.typeId)
              )
            ) OR 
            (min_prices.min_nominal IS NULL AND min_prices.min_price = (SELECT MIN(t.price) FROM types AS t WHERE t.typeId = r.typeId))
          )
          INNER JOIN types AS t ON r.typeId = t.typeId
          ${name || city || province || capacity ? "WHERE" : ""} ${filterName} ${filterCity} ${filterProvince} ${filterCapacity}
        GROUP BY 
          p.propertyId, 
          p.name, 
          c.city
        ORDER BY 
          ${sortData}
          LIMIT ${limit}
          OFFSET ${name && page == 0? 0 : offset};`, {
        type: QueryTypes.SELECT
      });
      const totalPage = Math.ceil(data0.length / limit);
      if (data.length > 0) {
        return res.status(200).send({
          data: data,
          page,
          limit,
          options: data0,
          totalRows: data0.length,
          totalPage,
        });
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
          page: 1,
          limit,
          options: data0,
          totalRows: 0,
          totalPage: 0
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
}