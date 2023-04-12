const { QueryTypes } = require("sequelize")
const {dbSequelize} = require("../config/db")
const {reviewModel, userModel} = require("../model/")

module.exports = {
    getReviews : async (req, res) =>{
        try {
            const {id}= req.query
            const reviews = await dbSequelize.query(`SELECT rv.createdAt, rv.desc, u.name, u.profileImg, t.name as roomName from reviews AS rv INNER JOIN orderlists AS o
            ON rv.transactionId = o.transactionId INNER JOIN rooms AS r
            ON r.roomId = o.roomId INNER JOIN properties AS p
            ON r.propertyId = p.propertyId INNER JOIN users as u
            ON rv.userId = u.userId INNER JOIN types as t 
            ON r.typeId = t.typeId where p.propertyId = ${id};`, {type: QueryTypes.SELECT})
            return res.status(200).send({
                success: true,
                result: reviews
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    createReview: async (req, res) =>{
        try {
            const user = await userModel.findAll({where:{
                email: req.body.email
            }})
            if(user.length > 0){
                const createReview = await reviewModel.create({
                    userId: user[0].userId,
                    transactionId: req.body.transactionId,
                    desc: req.body.desc
                })
                return res.status(200).send({
                    success: true,
                    message: "Review posted, thank you for the review"
                })
            }else{
                return res.status(401).send({
                    success: false,
                    message: "You are not authorized to post this review"
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success: false,
                message:"Database error."
            })
        }
    },
    checkReviews : async (req, res) =>{
        try {
            const reviews = reviewModel.findAll({
                where:{
                    transactionId: req.body.transactionId
                }
            })
            if(reviews.length > 0){
                
            }
        } catch (error) {
            
        }
    }
}