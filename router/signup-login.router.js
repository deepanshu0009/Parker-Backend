var express=require("express");
var controller=require("../controllers/Signup-login.controller");

var app=express.Router();

app.post("/signup-user-post",controller.signupuser);

app.get("/currentuser",controller.currentuser);
app.post("/login-with-post",controller.loginuser);



module.exports=app;