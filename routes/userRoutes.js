const express = require("express");
const authController = require("./../controllers/authControllers");
const router = express.Router();

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
//router.post("/forgetPassword", authController.forgetPassword);
//router.patch("/resetPassword", authController.resetPassword);

module.exports = router;
