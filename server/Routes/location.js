const router = require("express").Router();
const isAuthenticated = require("../Middleware/userAuthentication");
const locationController = require("../Controller/locationController");

router.patch("/update", isAuthenticated, locationController.updateLocation);

module.exports = router;
