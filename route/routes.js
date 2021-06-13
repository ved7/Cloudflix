const express = require("express");
const authController = require("../controllers/auth");
const Router = express.Router();
var VerifyToken = require("../controllers/verify");
Router.post("/register", authController.register);
Router.post("/login", authController.login);

Router.get("/dashboard",VerifyToken,function (req, res, next) {
  return res.render("dashboard");
});

module.exports = Router;
