const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const userModel = require("./userModel");
const { DataTypes } = Sequelize;

const tenantModel = dbSequelize.define("tenants", {
  tenantId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  noKtp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ktpImg: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { tenantModel };
