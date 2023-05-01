const { roomAvailabilityController } = require("../controller");

const route = require("express").Router();

route.get("/room-availability/all", roomAvailabilityController.checkAvailability);
route.post("/room-availability/add", roomAvailabilityController.addAvailability);
route.patch("/room-availability/delete", roomAvailabilityController.deleteRoomNotAvailable);

module.exports = route;