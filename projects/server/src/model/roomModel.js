const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const roomModel = dbSequelize.define("rooms", {
  roomId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  //fk
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //fk
  typeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  occupancy: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
});

module.exports = { roomModel };
