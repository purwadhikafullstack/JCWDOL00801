const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const orderListModel = dbSequelize.define("orderLists", {
  orderId: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
  },
  //fk
  roomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //fk
  transactionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  //fk
  guestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

module.exports = { orderListModel };
