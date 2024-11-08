const User = require("../models/userModel");
const { generateOtp } = require("../middleware/loginToken");

// Generate OTP and save to user
exports.generateOtp = async (req, res) => {
    const { phoneOrEmail } = req.body;

    if (!phoneOrEmail) {
        return res.status(400).json({ error: "Phone/email is required" });
    }

    try {
        const otp = generateOtp();
        const otpExpiry = Date.now() + 5 * 60 * 1000; // Valid for 5 minutes

        let user = await User.findOne({ phoneOrEmail });
        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        } else {
            user = new User({ phoneOrEmail, otp, otpExpiry });
        }

        await user.save();
        console.log("Generated OTP:", otp);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error generating OTP:", error);
        res.status(500).json({ error: "Failed to generate OTP" });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { phoneOrEmail, otp } = req.body;

    try {
        const user = await User.findOne({ phoneOrEmail });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ error: "Failed to verify OTP" });
    }
};

