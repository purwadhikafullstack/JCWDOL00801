const route = require("express").Router();
const { uploader } = require("../config/uploader");
const { propertyController } = require("../controller");

route.post(
  "/property/new",
  uploader("/propertyImg", "IMGPROPERTY").array("images", 1),
  propertyController.create
);
route.get("/property", propertyController.getData);
route.patch("/property/update/:propertyId", propertyController.update);
route.get("/property/:propertyId", propertyController.getEditData);
route.post("/property/all", propertyController.getPropertyData);
route.post("/property/find/:id", propertyController.getProperties);
route.patch(
  "/property/edit",
  uploader("/propertyImg", "IMGPROPERTY").array("images", 1),
  propertyController.updateEditData
);
route.get("/propety/check/:propertyId", propertyController.checkData);
route.get("/property/room/:id/:roomId", propertyController.getRoomData);
route.get("/property/room/:id/", propertyController.getAllRoomData);
module.exports = route;
