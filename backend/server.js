const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");

// Load env vars before reading deployment config.
dotenv.config();

// Use public DNS resolvers so MongoDB Atlas SRV lookups do not depend on a flaky local resolver.
dns.setServers((process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1").split(","));

const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/leaderboard", require("./routes/leaderboard"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error occurred" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
