const express = require("express");
const router = express.Router();
const Verify = require("../middleware/authmiddleware")

const userController = require("../controllers/userController");

router.post('/signup', userController.userSignup);
router.post('/login', userController.signin);
router.post('/dashboard', Verify, userController.dashboard);
module.exports = router;