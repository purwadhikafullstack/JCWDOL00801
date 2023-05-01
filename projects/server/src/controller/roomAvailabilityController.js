const {
    QueryTypes, Op
} = require("sequelize");
const {
    dbSequelize
} = require("../config/db");
const {
    roomAvailModel
} = require("../model/roomAvailModel");
const { userModel, tenantModel } = require("../model");

module.exports = {
    checkAvailability: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 5;
            const offset = limit * page;
            const roomAvailTotal = await dbSequelize.query(`
            SELECT * from roomavailabilities AS ra WHERE
            ra.roomId = ${req.query.id} AND (ra.startDate > ${dbSequelize.escape(new Date())} OR ra.endDate > ${dbSequelize.escape(new Date())});
            `, {type: QueryTypes.SELECT})
            const roomAvail = await dbSequelize.query(`
            SELECT * from roomavailabilities AS ra WHERE
            ra.roomId = ${req.query.id} AND (ra.startDate > ${dbSequelize.escape(new Date())} OR ra.endDate > ${dbSequelize.escape(new Date())})
            LIMIT ${limit}
            OFFSET ${offset};
            `, {type: QueryTypes.SELECT})
            // const roomAvail = await roomAvailModel.findAndCountAll({
            //     where: { [Op.and] : [{
            //         roomId: req.query.id
            //     }]
            //     },
            //     limit,
            //     offset
            // })
            const totalPage = Math.ceil(roomAvailTotal.length / limit);
            if (roomAvail.length > 0) {
                return res.status(200).send({
                    success: true,
                    data: roomAvail,
                    page,
                    limit,
                    totalRows: roomAvailTotal.length,
                    totalPage,
                })
            }else{
                return res.status(404).send({
                    success: false,
                    message: "Not Found"
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
    addAvailability: async (req,res) =>{
        try {
            const exist = await dbSequelize.query(`SELECT ra.raId, ra.roomId from roomavailabilities AS ra
            WHERE ra.roomId = ${req.body.roomId} AND ((${dbSequelize.escape(new Date(req.body.startDate))} BETWEEN ra.startDate AND ra.endDate)
            OR (${dbSequelize.escape(new Date(req.body.endDate))} BETWEEN ra.startDate AND ra.endDate))`, {type: QueryTypes.SELECT})
            if(exist.length > 0) {
                return res.status(409).send({
                    success: false,
                    message: "Room has already been set on chosen dates, please try another dates."
                })
            }
            const createNotAvail = await roomAvailModel.create({
                roomId: req.body.roomId,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            })
            return res.status(200).send({
                success:true,
                message: "Not available room date added"
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database error"
            })
        }
    },
    deleteRoomNotAvailable: async (req, res) =>{
        try {
            const user = await userModel.findOne({
                where: {
                    email: req.body.email
                }
            });
            const tenant = await tenantModel.findOne({
                where: {
                    userId : user.userId
                }
            })
            const currentCreatedAt = new Date(tenant.createdAt).setFullYear(new Date(tenant.createdAt).getFullYear() - 1);
            const currentYear = new Date(currentCreatedAt)
            const update = await roomAvailModel.update({
                startDate: currentYear,
                endDate: currentYear
            },{
                where:{
                    raId: req.body.raId
                }
            })
            return res.status(200).send({
                success: true,
                message: "Room has been set to available!"
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error"
            })
        }
    }
}