const {Sequelize} = require('sequelize');
const { dbSequelize } = require('../config/db');
const {DataTypes} = Sequelize;

const propertyFcModel = dbSequelize.define("propertyfacilities", {
    pfId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    //fk
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    //fk
    facilityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
})

module.exports = {propertyFcModel}