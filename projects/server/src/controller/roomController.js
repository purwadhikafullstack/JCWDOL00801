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
    userModel,
    categoryModel,
    typeModel
} = require("../model");

module.exports = {
    getRoomData: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 5;
            const offset = limit * page;
      
            const { name, type, sortby, typeName, propName } = req.query;
            const order = req.query.order || "asc";
            let filterData = [];
            let sortDefault = [];
            let sortData = [];
            console.log(sortby)
            if (name) {
              filterData.push({
                [Op.or]: [
                  {
                    name: {
                      [Op.like]: "%" + name + "%",
                    },
                  },
                ],
              });
            }
            if (type) {
              filterData.push({
                typeId: type,
              });
            }
            if (sortby == "name" || sortby == "price") {
              sortData.push(["type",sortby, order.toUpperCase()]);
            } else {
              sortData.push(["roomId", "DESC"]);
            }
            
            console.log(sortData)
            // const data = await dbSequelize.query(`SELECT t.name as typeName, p.name as propName, t.price, t.typeImg, r.roomId, r.isDeleted from rooms as r INNER JOIN properties as p
            // ON r.propertyId = p.propertyId INNER JOIN tenants AS ten ON p.tenantId = ten.tenantId
            // INNER JOIN types as t on r.typeId = t.typeId WHERE ten.tenantId = ${dbSequelize.escape(req.query.tenant)} OR t.name LIKE '%${typeName}%' OR p.name LIKE '%${propName}%' ORDER BY ${req.query.type ? dbSequelize.escape(req.query.type) : "r.roomId"} ${order} limit ${limit} offset ${offset};
            // `, {type: QueryTypes.SELECT})
            const data = await roomModel.findAndCountAll({
                include: [{
                  model: propertyModel,
                  as: "property",
                  required: true,
                  where: {
                    tenantId: req.query.tenant
                  }
                }, {model: typeModel, as: "type"}],
                [Op.and]: filterData,
                order: sortData,
                offset: offset,
                limit: limit,
              });
            console.log("LENGTH", data)
            const totalPage = Math.ceil(data.count / limit);
            if (data.count > 0) {
              return res.status(200).send({
                data: data.rows,
                page,
                limit,
                totalRows: data.count,
                totalPage,
              });
            } else {
              return res.status(404).send({
                message: `Data Not Found`,
                data: [],
              });
            }
          } catch (error) {
            console.log(error);
            return res.status(500).send(error);
          }
    },
    getTypeRoom : async(req, res) =>{
        try {
            const {id} = req.query;
            const user = await userModel.findAll({
                where: {
                    email: req.decrypt.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            const room = await roomModel.findAll({
                where: {
                  propertyId: id
                }
              });
              
              const roomArr = room.map(val => ({
                typeId: val.typeId
              }));
              const filteredType = roomArr.filter((val, index, self) => {
                return index === self.findIndex((t) => t.typeId === val.typeId);
              });
              const type = await typeModel.findAll({
                where: {
                    [Op.or] : filteredType
                }
              })
              return res.status(200).send({
                success: true,
                result: type
              })
        } catch (error) {
            
        }
    },
    createRoom: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.decrypt.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                const createRooms = await roomModel.create({
                    propertyId: req.body.propertyId,
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
    createRoomAndType: async (req, res) => {
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.decrypt.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if (tenant.length > 0) {
                    const createType = await typeModel.create({
                        name: req.body.name,
                        price: req.body.price,
                        desc: req.body.desc,
                        typeImg: req.body.picture,
                        capacity: req.body.capacity,
                        typeImg: `/typeImg/${req.files[0].filename}`
                    })
                    console.log(req.files[0].filename)
                    const createRoom = await roomModel.create({
                        propertyId: req.body.propertyId,
                        typeId: createType.typeId,
                    })
                    return res.status(200).send({
                        success: true,
                        message: "Room Created"
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
                    email: req.decrypt.email
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
    },
    checkAvailProperty: async (req, res) =>{
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.decrypt.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if(tenant.length > 0){
                const availProp = await propertyModel.findAll({
                    where: {
                        [Op.and] :[{tenantId: tenant[0].tenantId, isDeleted: 0 || false}]
                    }
                })
                if(availProp.length < 1){
                    return res.status(401).send({
                        success: false,
                        message: "You have not created any property yet. Try to create it?"
                    })
                }
                return res.status(200).send({
                    success: true,
                    result: availProp
                })
            }
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: "Database Error"
            })
        }
    },
    getChosenPropertyData: async (req, res) =>{
        try {
            const user = await userModel.findAll({
                where: {
                    email: req.decrypt.email
                }
            })
            const tenant = await tenantModel.findAll({
                where: {
                    userId: user[0].userId
                }
            })
            if(tenant.length > 0){
                const chosenProp = await propertyModel.findOne({
                    where: {
                        [Op.and] :[{tenantId: tenant[0].tenantId, isDeleted: 0 || false, propertyId: req.query.id}] 
                    }
                })
                const category = await categoryModel.findOne({
                    where: {
                        categoryId: chosenProp.categoryId
                    }
                })
                return res.status(200).send({
                    success: true,
                    prop: chosenProp,
                    category: category
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success: false,
                message: "Database Error"
            })
        }
    },
    getRoomType : async (req, res) => {
        try {
            const {id} = req.query;
            const room = await roomModel.findAll({
                where: {
                  propertyId: id
                }
              });
        
              const roomArr = room.map(val => ({
                typeId: val.typeId
              }));
              const filteredType = roomArr.filter((val, index, self) => {
                return index === self.findIndex((t) => t.typeId === val.typeId);
              });
              const type = await typeModel.findAll({
                where: {
                    [Op.or] : filteredType
                }
              })
              return res.status(200).send({
                success: true,
                result: type
              })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error"
            })
        }
    },
    getCurrentPropEdit : async (req, res) =>{
        try {
            const room = await roomModel.findOne({
                where: {
                    roomId : req.query.id
                }
            })
            const property = await propertyModel.findOne({
                where: {
                    propertyId: room.propertyId
                }
            })
            res.status(200).send({
                success: true,
                result: property
            })
        } catch (error) {
            console.log(error),
            res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    getRoomTypeData: async (req, res) =>{
        try {
            const { id } = req.query
            const type = await typeModel.findOne({
                where: {
                    typeId: id
                }
            })
            return res.status(200).send({
                success: true,
                result: type
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: "Database Error."
            })
        }
    },
    update: async (req, res) => {
        try {
          // akan ditambahkan ketika fitur transaksi sudah di merge
          // const check = await orderListModel.findAll({
          //   include: [
          //     {
          //       model: transactionModel,
          //       as: "transaction",
          //       required: true,
          //       where: {
          //         [Op.and]: [{ status: "Waiting for payment" }, { status: "Waiting for confirmation" }],
          //       },
          //     },
          //     {
          //       model: roomModel,
          //       as: "room",
          //       required: true,
          //       include: {
          //         model: propertyModel,
          //         as: "property",
          //         required: true,
          //         where: {
          //           propertyId: req.params.propertyId,
          //         },
          //       },
          //     },
          //   ],
          // });
          console.log(req.query.roomId)
          let update = await roomModel.update(req.body, {
            where: {
              roomId: req.params.roomId,
            },
          });
          if (update) {
            return res.status(200).send({
              success: true,
              message: `Data Updated Successfully`,
            });
          }
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      },
}