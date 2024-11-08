const express = require("express");
const mongoose = require("mongoose");
const loginRoutes = require("./routes/loginRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();
app.use(express.json());

const MONGODB_URI = "mongodb://localhost:27017/user";
const PORT = 3000;

// Register routes
app.use("/", loginRoutes);
app.use("/", otpRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
