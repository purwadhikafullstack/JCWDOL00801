const { userModel } = require("./userModel");
const { tenantModel } = require("./tenantModel");
const { propertyModel } = require("./propertyModel");
const { categoryModel } = require("./categoryModel");
const { transactionModel } = require("./transactionModel");
const { reviewModel } = require("./reviewModel");
const { guestModel } = require("./guestModel");
const { orderListModel } = require("./orderListModel");
const { roomModel } = require("./roomModel");
const { typeModel } = require("./typeModel");
const { roomAvailModel } = require("./roomAvailModel");
const { specialPriceModel } = require("./specialPriceModel");
const { roomImageModel } = require("./roomImageModel");
const { facilityModel } = require("./facilityModel");
const { propertyFcModel } = require("./propertyFcModel");
const { paymentMethodModel } = require("./paymentMethod");

userModel.hasMany(tenantModel, {
  foreignKey: "userId",
});
tenantModel.belongsTo(userModel, {
  as: "user",
  foreignKey: "userId",
});

tenantModel.hasMany(propertyModel, {
  foreignKey: "tenantId",
});

propertyModel.belongsTo(tenantModel, {
  as: "tenant",
  foreignKey: "tenantId",
});

// CATEGORY TO PROPERTY
categoryModel.hasMany(propertyModel, {
  foreignKey: "categoryId",
});
propertyModel.belongsTo(categoryModel, {
  as: "category",
  foreignKey: "categoryId",
});

userModel.hasMany(transactionModel, {
  foreignKey: "userId",
});

transactionModel.belongsTo(userModel, {
  as: "user",
  foreignKey: "userId",
});

userModel.hasMany(reviewModel, {
  foreignKey: "userId",
});

reviewModel.belongsTo(userModel, {
  as: "user",
  foreignKey: "userId",
});

transactionModel.hasMany(reviewModel, {
  foreignKey: "transactionId",
});

reviewModel.belongsTo(transactionModel, {
  as: "transaction",
  foreignKey: "transactionId",
});

guestModel.hasMany(orderListModel, {
  foreignKey: "guestId",
});

orderListModel.belongsTo(guestModel, {
  as: "guest",
  foreignKey: "guestId",
});

transactionModel.hasMany(orderListModel, {
  foreignKey: "transactionId",
});

orderListModel.belongsTo(transactionModel, {
  as: "transaction",
  foreignKey: "transactionId",
});

roomModel.hasMany(orderListModel, {
  foreignKey: "roomId",
});

orderListModel.belongsTo(roomModel, {
  as: "room",
  foreignKey: "roomId",
});

typeModel.hasMany(roomModel, {
  foreignKey: "typeId",
});

typeModel.belongsTo(roomModel, {
  as: "type",
  foreignKey: "typeId",
});

propertyModel.hasMany(roomModel, {
  foreignKey: "propertyId",
});

roomModel.belongsTo(propertyModel, {
  as: "property",
  foreignKey: "propertyId",
});

roomModel.hasMany(roomAvailModel, {
  foreignKey: "roomId",
});

roomAvailModel.belongsTo(roomModel, {
  as: "room",
  foreignKey: "roomId",
});

roomModel.hasMany(specialPriceModel, {
  foreignKey: "roomId",
});

specialPriceModel.belongsTo(roomModel, {
  as: "room",
  foreignKey: "roomId",
});

roomModel.hasMany(roomImageModel, {
  foreignKey: "roomId",
});

roomImageModel.belongsTo(roomModel, {
  as: "room",
  foreignKey: "roomId",
});

facilityModel.hasMany(propertyFcModel, {
  foreignKey: "facilityId",
});

propertyFcModel.belongsTo(facilityModel, {
  as: "facilty",
  foreignKey: "facilityId",
});

propertyModel.hasMany(propertyFcModel, {
  foreignKey: "propertyId",
});

propertyFcModel.belongsTo(propertyModel, {
  as: "property",
  foreignKey: "propertyId",
});

paymentMethodModel.hasMany(tenantModel, {
  foreignKey: "bankId"
})
tenantModel.belongsTo(paymentMethodModel, {
  as: "bank",
  foreignKey: "bankId"
})
paymentMethodModel.hasMany(transactionModel, {
  foreignKey: "bankId"
})
transactionModel.belongsTo(paymentMethodModel, {
  as: "bank",
  foreignKey: "bankId"
})
module.exports = {
  userModel,
  tenantModel,
  propertyModel,
  categoryModel,
  transactionModel,
  reviewModel,
  guestModel,
  orderListModel,
  roomModel,
  typeModel,
  roomAvailModel,
  specialPriceModel,
  roomImageModel,
  facilityModel,
  propertyFcModel,
  paymentMethodModel
};