const {Sequelize} = require("sequelize");
const {dbSequelize} = require("../config/db");
const userModel = require("./userModel");
const {DataTypes} = Sequelize;

const paymentMethodModel = dbSequelize.define("paymentmethods", {
    bankId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bankLogo: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = {paymentMethodModel}