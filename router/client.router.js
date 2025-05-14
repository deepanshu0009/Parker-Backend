var express = require("express");
var controller = require("../controllers/userprofile.controller");
var parkingController = require("../controllers/parking.controller");
var fillslotController = require("../controllers/fillslot.controller");

var app = express.Router();

// Routes for user profile management
app.post("/saveprofile-client-post", controller.saveUserInfo);
app.get("/fetch-client-get", controller.fetchUserDetails);
app.post("/updateprofile-client-post", controller.updateUserInfo);

// Route to fetch all cities
app.get("/fetchcity-client-get", parkingController.fetchAllCities);

// Route to fetch parking details by city
app.get("/fetchparkingfromcity-client-get", parkingController.fetchParkingFromCity);

// Route to fetch free space
app.get("/fetch-freespace-get", fillslotController.fetchFreeSpace);

// Route to book a slot
app.post("/fillslot-post", fillslotController.bookSlot);

module.exports = app;