const { tokenVerify } = require("../config/encrypt");
const { uploader2 } = require("../config/uploader2");
const { roomController } = require("../controller");
const route = require("express").Router();

route.post("/rooms", roomController.getRoomData)
route.post("/rooms/new", tokenVerify, roomController.createRoom)
route.post("/rooms/new-type", uploader2("/typeImg", "TYPEIMG").array('images', 1), tokenVerify, roomController.createRoomAndType)
route.post("/rooms/update",uploader2("/typeImg", "TYPEIMG").array('images', 1), tokenVerify,roomController.updateRoom)
route.get("/rooms/prop-availability", tokenVerify, roomController.checkAvailProperty)
route.get("/rooms/prop-availability/find", tokenVerify, roomController.getChosenPropertyData)
route.get("/rooms/prop-availability/find/type", roomController.getRoomType)
route.get("/rooms/current-prop", roomController.getCurrentPropEdit)
route.get("/rooms/prop-availability/find/type-one", roomController.getRoomTypeData);
route.patch("/rooms/update/:roomId", roomController.update);
route.get("/rooms/all", roomController.getRoomData);

module.exports = route;