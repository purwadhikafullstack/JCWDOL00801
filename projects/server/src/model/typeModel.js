const {Sequelize} = require('sequelize');
const { dbSequelize } = require('../config/db');
const {DataTypes} = Sequelize;

const typeModel = dbSequelize.define("types", {
    typeId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    typeImg: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }
})

module.exports = {typeModel}