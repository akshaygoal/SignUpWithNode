const express = require('express');
const { generateOtp, verifyOtp } = require('../controllers/otpController');
const otpRouter = express.Router();

otpRouter.post('/generate-otp', generateOtp);
otpRouter.post('/verify-otp', verifyOtp);

module.exports = otpRouter;
