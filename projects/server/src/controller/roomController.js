const {
    Op,
    QueryTypes
} = require("sequelize");
const {
    dbSequelize
} = require("../config/db");
const {
    propertyModel,
    roomModel,
    tenantModel,
    userModel
} = require("../model");

module.exports = {
    getRoomData: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                const property = await propertyModel.findAll({
                    where: {
                        [Op.and]: [{
                            tenantId: tenant[0].tenantId
                        }, {
                            isDeleted: false || 0
                        }]
                    }
                })
                const propArr = property.map(val => ({
                    propertyId: val.propertyId,
                    isDeleted: false || 0
                }))
                const sortBy =  req.body.sortBy || ["roomId", "ASC"] ;
                const roomData = await roomModel.findAll({
                    where: {
                        [Op.and]: propArr
                    },
                    order: [sortBy]
                })
                return res.status(200).send({
                    success: true,
                    result: roomData,
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Please login using your tenant account"
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database error"
            })
        }
    },
    deleteRoom: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                const deleteRoom = await roomModel.update({
                    isDeleted: true
                }, {
                    where: {
                        roomId: req.body.roomId
                    }
                })
                return res.status(200).send({
                    success: true,
                    message: "Room deleted"
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Please login using your tenant account"
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    createRoom: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                const createRooms = await roomModel.create({
                    propertyId: req.body.property,
                    typeId: req.body.typeId,
                })
                return res.status(200).send({
                    success: true,
                    message: "Room created"
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Please login using your tenant account"
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    getCurrentRoomData: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                const rooms = await roomModel.findAll({
                    where: {
                        [Op.and]: [{
                            roomId: req.body.roomId,
                            isDeleted: 0 || false
                        }]
                    }
                })
                return res.status(200).send({
                    success: true,
                    result: rooms
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Please login using your tenant account"
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    updateRoom: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.body.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                const updatedRoom = await roomModel.update({

                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database error"
            })
        }
    }
}