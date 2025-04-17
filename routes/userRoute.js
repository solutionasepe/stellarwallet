const express = require("express");
const router = express.Router();
const Verify = require("../middleware/authmiddleware");
const isTokenBlacklisted = require("../middleware/authmiddleware");

const userController = require("../controllers/userController");


router.get('/users', userController.Users)
router.post('/signup', userController.userSignup);
router.post('/signin', userController.signin);
router.post('/dashboard', Verify, isTokenBlacklisted, userController.dashboard);
router.post('/logout', isTokenBlacklisted, userController.signOut);
router.post('/requestpasswordreset', userController.requestPasswordReset);
router.post('/reset-password/:resetToken', userController.passworReset);
router.post('/deleteuser', userController.deleteUsers);
module.exports = router;