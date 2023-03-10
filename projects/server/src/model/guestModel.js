const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const guestModel = dbSequelize.define("guests", {
  guestId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  adult: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  child: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  baby: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = { guestModel };
