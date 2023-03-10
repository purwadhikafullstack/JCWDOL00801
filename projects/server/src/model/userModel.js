const { Sequelize } = require("sequelize");
const { dbSequelize } = require("../config/db");
const { DataTypes } = Sequelize;

const userModel = dbSequelize.define("users", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImg: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  countOtp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  expiredOtp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "common",
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
});

module.exports = { userModel };
