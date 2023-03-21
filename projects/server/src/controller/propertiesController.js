const Sequelize = require("sequelize");
const {
  propertyModel,
  typeModel,
  roomModel,
  roomAvailModel,
} = require("../model");

module.exports = {
  getProperties: async (req, res) => {
    const { id } = req.params;
    try {
      let property = await propertyModel.findOne({ where: { propertyId: id } });

      if (!property) {
        return res.status(404).send({
          success: false,
          message: "Property not found",
        });
      }

      let room = await roomModel.findAll({ where: { propertyId: id } });

      let roomArr = [];

      room.map((val) => roomArr.push({ typeId: val.typeId }));
      let filteredType = roomArr.filter((val, index, self) => {
        return index === self.findIndex((t) => t.typeId === val.typeId);
      });
      // console.log("filteredType", filteredType);
      // console.log("roomArr ->", roomArr);

      let type = await typeModel.findAll({
        where: { [Sequelize.Op.or]: filteredType },
      });

      let roomAvail = await roomAvailModel.findAll({
        where: { roomId: 2 },
      });

      if (roomAvail.length > 0) {
        let bookedRooms = roomAvail.filter((val) => {
          return (
            new Date(req.body.endDate) < val.endDate &&
            new Date(req.body.startDate) > val.startDate
          );
        });
        // console.log("bookedRooms ->", bookedRooms);
        return res.status(200).send({
          success: true,
          message: "roomAvail.length > 0",
          property,
          room,
          type,
          roomAvail,
          bookedRooms,
        });
      }

      // let startDate = new Date();
      // let endDate = new Date();

      return res.status(200).send({
        success: true,
        property,
        room,
        type,
        roomAvail,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "There's an error occurred on the server",
      });
    }
  },
};
