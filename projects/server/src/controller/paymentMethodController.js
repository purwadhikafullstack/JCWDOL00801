const { Op } = require("sequelize");
const { paymentMethodModel, userModel, tenantModel } = require("../model");

module.exports = {
  getData: async (req, res) => {
    try {
      const data = await paymentMethodModel.findAll({
        order: ["bankId"],
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  checkData : async (req, res) =>{
    try {
      const user = await userModel.findAll({
        where: {
          email: req.decrypt.email}
      })
      const tenant = await tenantModel.findAll({
        where: {
          userId: user[0].userId}
      })
      if(!tenant[0].bankAccountNum || !tenant[0].bankId){
        return res.status(401).send({
          success: true,
          message: "You have not update your bank, please update it first on 'My Profile'."
        })
      }
      
        return res.status(200).send({
          success: true,
          message: "allowed"
        })
      
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        success: false,
        message: "Database Error."
      })
    }
  }
};
