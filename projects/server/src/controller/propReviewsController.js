const { QueryTypes } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { reviewModel, userModel } = require("../model/");

module.exports = {
  getReviews: async (req, res) => {
    try {
      const { id } = req.query;
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 2;
      const offset = limit * page;
      const { startDate, endDate } = req.body;
      const reviews1 = await dbSequelize.query(
        `SELECT rv.createdAt, rv.desc, u.name, u.profileImg, t.name as roomName from reviews AS rv INNER JOIN orderlists AS o
            ON rv.transactionId = o.transactionId INNER JOIN rooms AS r
            ON r.roomId = o.roomId INNER JOIN properties AS p
            ON r.propertyId = p.propertyId INNER JOIN users as u
            ON rv.userId = u.userId INNER JOIN types as t 
            ON r.typeId = t.typeId where p.propertyId = ${id};
            `,
        { type: QueryTypes.SELECT }
      );
      const reviews = await dbSequelize.query(
        `SELECT rv.createdAt, rv.desc, u.name, u.profileImg, t.name as roomName from reviews AS rv INNER JOIN orderlists AS o
            ON rv.transactionId = o.transactionId INNER JOIN rooms AS r
            ON r.roomId = o.roomId INNER JOIN properties AS p
            ON r.propertyId = p.propertyId INNER JOIN users as u
            ON rv.userId = u.userId INNER JOIN types as t 
            ON r.typeId = t.typeId where p.propertyId = ${id}
            limit ${limit} offset ${offset};
            `,
        { type: QueryTypes.SELECT }
      );
      const totalPage = Math.ceil(reviews1.length / limit);
      if (reviews.length > 0) {
        return res.status(200).send({
          result: reviews,
          page,
          limit,
          totalRows: reviews1.length,
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
      return res.status(500).send({
        success: false,
        message: "Database Error.",
      });
    }
  },
  createReview: async (req, res) => {
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email,
        },
      });
      if (user.length > 0) {
        const createReview = await reviewModel.create({
          userId: user[0].userId,
          transactionId: req.body.transactionId,
          desc: req.body.desc,
        });
        return res.status(200).send({
          success: true,
          message: "Review posted, thank you for the review",
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "You are not authorized to post this review",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error.",
      });
    }
  },
  checkReviews: async (req, res) => {
    try {
      const reviews = await reviewModel.findAll({
        where: {
          transactionId: req.body.transactionId,
        },
      });
      return res.status(200).send({
        success: true,
        result: reviews,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
  updateReview: async (req, res) => {
    try {
      const review = await reviewModel.update(
        {
          desc: req.body.desc,
        },
        {
          where: {
            transactionId: req.body.id,
          },
        }
      );
      return res.status(200).send({
        success: true,
        message: "Review updated!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Database error",
      });
    }
  },
};
