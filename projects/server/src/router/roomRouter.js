const { roomController } = require("../controller");
const route = require("express").Router();

route.post("/rooms", roomController.getRoomData)
route.post("/rooms/new", roomController.createRoom)
route.post("/rooms/delete", roomController.deleteRoom)
route.post("/rooms/update", roomController.updateRoom)

module.exports = route;