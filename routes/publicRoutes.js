const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// User Routes + auth routes
router.post("/register", userController.Register);
router.post("/login", userController.Login);

module.exports = router;
