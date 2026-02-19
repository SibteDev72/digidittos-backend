const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { registerValidation, loginValidation } = require("./auth.validation");
const validate = require("../../middleware/validate");
const { protect } = require("../../middleware/auth");

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

module.exports = router;
