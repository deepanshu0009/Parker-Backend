var express = require("express");
var controller = require("../controllers/provider.controller");
var controller2 = require("../controllers/fillslot.controller");
var controller3 = require("../controllers/parking.controller");
var controller4 = require("../controllers/freeslot.controller");

var app = express.Router();

app.post("/saveprofile-provider-post", controller.saveProviderInfo);
app.get("/fetch-provider-get", controller.fetchProviderDetails);
app.post("/updateprofile-provider-post", controller.updateProviderInfo);

app.post("/save-parking-and-create-slots", controller3.saveParkingAndCreateSlots);
app.get("/fetch-parking-get", controller3.fetchParkingDetails);
app.post("/updateparking-post", controller3.updateParkingDetails);

app.get("/fetch-freespace-get", controller2.fetchFreeSpace);
app.post("/fillslot-post", controller2.bookSlot);

app.get("/rate-post", controller4.fetchRate);

module.exports = app;