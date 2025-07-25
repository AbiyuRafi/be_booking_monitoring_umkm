const express = require("express");
const router = express();

const UserController = require("../controllers/UserController");
const { jwtAuthMiddleware } = require("../services/Passport");

router.post('/api/login', UserController.login);
router.get('/api/auth/me', jwtAuthMiddleware(), UserController.checkAuth);

router.get('/api/users', UserController.getAllUsers);
router.get('/api/users/konsultan', UserController.getAllKonsultan);
router.post('/api/users', UserController.register);

module.exports = router;
