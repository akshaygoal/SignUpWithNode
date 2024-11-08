const User = require("../models/userModel");
const { generateOtp } = require("../middleware/otpService");
const bcrypt = require("bcryptjs");
const { validateEmail, validatePhone } = require("../middleware/validation");

exports.signup = async (req, res) => {
    const { username, phoneOrEmail, password, confirmPassword, role } = req.body;

    try {
        // Check for missing fields and validate phone/email format
        const missingFields = ["username", "phoneOrEmail", "password", "confirmPassword"]
            .filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(", ")}`,
                message: `The following fields are required: username, phoneOrEmail, password, confirmPassword.`
            });
        }

        if (!validateEmail(phoneOrEmail) && !validatePhone(phoneOrEmail)) {
            return res.status(400).json({
                error: "Invalid email or phone number",
                message: "Please provide a valid email or phone number."
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                error: "Passwords do not match",
                message: "Ensure both password fields are the same."
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ phoneOrEmail });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists with this phone/email",
                message: "An account with this phone or email already exists. Please try with a different one."
            });
        }

        // Hash the password, generate OTP, and create the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        console.log(`Generated OTP: ${otp}`);

        const user = new User({
            username,
            phoneOrEmail,
            password: hashedPassword,
            role: role || "customer",
            otp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false
        });

        await user.save();
        res.status(200).json({
            message: "OTP sent, please verify to complete registration"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error creating user",
            message: "An error occurred while processing your request. Please try again later."
        });
    }
};
