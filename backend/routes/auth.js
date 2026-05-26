const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getCurrentUser,
  verifyAuth,
  logoutUser
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/signup", registerUser);
router.post("/login", authUser);
router.get("/me", protect, getCurrentUser);
router.get("/verify", protect, verifyAuth);
router.post("/logout", protect, logoutUser);

module.exports = router;
