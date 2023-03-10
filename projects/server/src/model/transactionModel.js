const {Sequelize} = require('sequelize');
const { dbSequelize } = require('../config/db');
const {DataTypes} = Sequelize;

const transactionModel = dbSequelize.define("transactions", {
    transactionId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    //foreign key
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    checkinDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    checkoutDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Waiting for payment"
    },
    specialReq: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

module.exports = {transactionModel}