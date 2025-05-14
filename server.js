var express = require("express");
var mongoose = require("mongoose");
var userRouter = require("./router/signup-login.router");
var ProviderRouter = require("./router/provider.router");
var ClientRouter = require("./router/client.router");
var paymentRouter = require("./router/payment.router");
var cors = require("cors");
var bp = require("body-parser");
var fileupload = require("express-fileupload");

var app = express();

// MongoDB connection
var dburl = "mongodb://127.0.0.1:27017/parker";

mongoose.connect(dburl).then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(bp.urlencoded({ extended: true })); // To parse URL-encoded request bodies
app.use(fileupload());
app.use(cors());

// Routes
app.use("/user", userRouter);
app.use("/provider", ProviderRouter);
app.use("/client", ClientRouter);
app.use("/payment", paymentRouter);

app.listen(2002, () => {
  console.log("Server Started...");
});