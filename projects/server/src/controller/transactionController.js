const {
    encryptPassword,
    createToken
  } = require("../config/encrypt");
  const {
    userModel,
    transactionModel
  } = require("../model");
  const bcrypt = require("bcrypt");
  const {
    transport
  } = require("../config/nodemailer");
const { dbSequelize } = require("../config/db");
const { QueryTypes } = require("sequelize");

module.exports = {
    getNecessaryData: async (req, res) =>{
        try {
            const data = await dbSequelize.query(`select p.image, p.name, t.name as typeName, t.capacity, pay.bankName, pay.bankLogo, t.price from properties as p INNER JOIN rooms as r on p.propertyId = r.propertyId
            INNER JOIN types as t on r.typeId = t.typeId INNER JOIN tenants as ten on p.tenantId = ten.tenantId INNER JOIN paymentmethods as pay on ten.bankId = pay.bankId where p.propertyId = ${req.query.id} and t.typeId = ${req.body.typeId}`, {
            type: QueryTypes.SELECT  
            })
            console.log("its data",data)
            return res.status(200).send({
              success: true,
              result: data
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
              success: false,
              message: "Database Error"
            })
        }
    }
}