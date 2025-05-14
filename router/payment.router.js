var express = require("express");
var razorpayController = require("../controllers/razorpay.controller");

var app = express.Router();

// Razorpay routes
app.post("/create-order", razorpayController.Order);
app.post("/verify-payment", razorpayController.Paymentverify);

module.exports = app;