const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

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
    payProofImg: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Waiting for payment"
    },
    bankId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bankAccountNum: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalGuest: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    specialReq: {
        type: DataTypes.STRING,
        allowNull: true
    },
    transactionExpired: {
        type: DataTypes.DATE,
        allowNull: false
    }
})

module.exports = {transactionModel}