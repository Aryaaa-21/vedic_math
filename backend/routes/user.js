const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, syncUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/sync", protect, syncUserProfile);

module.exports = router;
