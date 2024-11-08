const express = require('express');
const { login } = require('../controllers/loginController');
const loginRouter = express.Router();

// POST /login route
loginRouter.post('/login', login);

module.exports = loginRouter;
