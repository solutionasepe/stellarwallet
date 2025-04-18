const express = require("express");
const router = express.Router();
const {Verify, isTokenBlacklisted} = require("../middleware/authmiddleware");

const userController = require("../controllers/userController");




/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of all users
 *       500:
 *         description: Server error
 */
router.get('/users', userController.Users)

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               pin:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post('/signup', userController.userSignup);

/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/signin', userController.signin);

/**
 * @swagger
 * /user/dashboard:
 *   post:
 *     summary: Access the dashboard
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Access granted to the dashboard
 *       400:
 *         description: Wrong pin
 *       401:
 *         description: Unauthorized
 */
router.post('/dashboard', Verify, isTokenBlacklisted, userController.dashboard);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', isTokenBlacklisted, userController.signOut);

/**
 * @swagger
 * /user/requestpasswordreset:
 *   post:
 *     summary: Request a password reset
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: User not found
 */
router.post('/requestpasswordreset', userController.requestPasswordReset);

/**
 * @swagger
 * /user/reset-password/{resetToken}:
 *   post:
 *     summary: Reset a user's password
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The reset token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 */
router.post('/reset-password/:resetToken', userController.passworReset);

/**
 * @swagger
 * /user/deleteuser:
 *   post:
 *     summary: Delete a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pin:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Incorrect pin
 *       404:
 *         description: User not found
 */
router.post('/deleteuser', userController.deleteUsers);
module.exports = router;