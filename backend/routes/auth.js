const express = require("express");
const router = express.Router();
const { registerUser, authUser, googleLogin } = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/login", authUser);
router.post("/google-login", googleLogin);


module.exports = router;
