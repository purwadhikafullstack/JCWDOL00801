const { QueryTypes } = require("sequelize");
const { dbSequelize } = require("../config/db");
const {specialPriceModel, userModel, tenantModel} = require("../model");

module.exports = {
    getSpecialPrice: async (req, res) =>{
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 3;
            const offset = limit * page;
            let filter = "";
            let sortBy = "";
            if(req.query.startDate && req.query.endDate){
                if(parseInt(req.query.startDate) === parseInt(req.query.endDate)){
                    filter = `AND (
                        sp.startDate >= ${dbSequelize.escape(new Date(parseInt(req.query.startDate)))} OR sp.endDate >= ${dbSequelize.escape(new Date(parseInt(req.query.startDate)))}
                    )`
                }else{
                    filter = `AND ((${dbSequelize.escape(new Date(parseInt(req.query.startDate)))} BETWEEN sp.startDate AND sp.endDate) 
                    OR(${dbSequelize.escape(new Date(parseInt(req.query.endDate)))} BETWEEN sp.startDate AND sp.endDate))`
                }
            }else{
                filter = `AND (
                    sp.startDate > ${dbSequelize.escape(new Date())} OR sp.endDate > ${dbSequelize.escape(new Date())}
                )`
            }
            if(req.query.sort){
                if(req.query.sort === "startDate"){
                    sortBy = `
                    ORDER BY
                        sp.startDate ${req.query.order}
                `
                }else if(req.query.sort === "nominal"){
                    sortBy = `
                    ORDER BY
                        sp.nominal ${req.query.order}
                `
                }   
            }else{
                sortBy = ""
            }
            const necessaryData = await dbSequelize.query(`
            SELECT * from types
            WHERE typeId = ${req.query.id}
            `, {type: QueryTypes.SELECT})
            const spAll = await dbSequelize.query(`
            SELECT t.name, sp.nominal, sp.startDate, sp.endDate, t.createdAt, sp.percentage, sp.spId FROM specialprices AS sp
            INNER JOIN types AS t ON sp.typeId = t.typeId
            INNER JOIN rooms AS r ON r.typeId = t.typeId
            WHERE t.typeId = ${req.query.id} ${filter}
            group by sp.spId
            ${sortBy}
            `, {type: QueryTypes.SELECT})
            const sp = await dbSequelize.query(`
            SELECT t.name, sp.nominal, sp.startDate, sp.endDate, t.createdAt, sp.percentage, sp.spId FROM specialprices AS sp
            INNER JOIN types AS t ON sp.typeId = t.typeId
            INNER JOIN rooms AS r ON r.typeId = t.typeId
            WHERE t.typeId = ${req.query.id} ${filter}
            group by sp.spId
            ${sortBy}
            LIMIT ${limit}
            OFFSET ${offset};
            `, {type: QueryTypes.SELECT});
            console.log("SP",necessaryData)
            const totalPage = Math.ceil(sp.length / limit);

            if (sp.length > 0) {
                return res.status(200).send({
                    success: true,
                    data: sp,
                    page,
                    limit,
                    totalRows: spAll.length,
                    totalPage,
                    necessaryData
                })
            }else if(necessaryData.length > 0){
                return res.status(200).send({
                    success: true,
                    data: sp,
                    page,
                    limit,
                    totalRows: spAll.length,
                    totalPage,
                    necessaryData
                })
            }
            else{
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
    addSpecialPrice: async (req, res) =>{
        try {
            const checkDuplicate = await dbSequelize.query(`
                SELECT * FROM specialprices AS sp
                INNER JOIN types AS t ON sp.typeId = t.typeId
                INNER JOIN rooms AS r ON r.typeId = t.typeId
                where r.roomId = ${req.body.roomId} AND ((
                    ${dbSequelize.escape(new Date(req.body.startDate))} BETWEEN sp.startDate AND sp.endDate
                ) OR
                    (
                        ${dbSequelize.escape(new Date(req.body.endDate))} BETWEEN sp.startDate AND sp.endDate
                    )
                )
            `, {type: QueryTypes.SELECT})
            if(checkDuplicate.length > 0){
                return res.status(409).send({
                    success: false,
                    message: "Cannot create special price, please use another date."
                })
            }
            const newSp = await specialPriceModel.create({
                typeId: req.body.typeId,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                nominal: req.body.nominal,
                percentage: req.body.percentage
            })
            return res.status(200).send({
                success: true,
                message: "New special price has been added."
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    deleteSpecialPrice: async (req, res) => {
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
            const update = await specialPriceModel.update({
                startDate: currentYear,
                endDate: currentYear
            }, {where: {
                spId: req.body.spId
            }})
            return res.status(200).send({
                success: true,
                message: "Special Price deleted."
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message: "Database error."
            })
        }
    }
}