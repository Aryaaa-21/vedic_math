const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const MIN_PASSWORD_LENGTH = 6;

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  joinedDate: user.joinedDate,
  level: user.level,
  xp: user.xp,
  streak: user.streak,
  accuracy: user.accuracy,
  badges: user.badges || [],
  completedTechniques: user.completedTechniques || [],
  challengeHistory: user.challengeHistory || [],
  profileImage: user.profileImage || "",
  avgSpeed: user.avgSpeed || 0,
  completedLessons: user.completedLessons || 0,
  challengeHighScore: user.challengeHighScore || 0,
  avatar: user.avatar || user.profileImage || "https://lh3.googleusercontent.com/a/default-user",
  recentActivities: user.recentActivities || []
});

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      joinedDate: new Date(),
      level: 1,
      xp: 0,
      streak: 0,
      accuracy: 0,
      badges: [],
      completedTechniques: [],
      challengeHistory: [],
      profileImage: "",
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: toSafeUser(user)
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: toSafeUser(user)
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const rawName = (req.body && req.body.name ? String(req.body.name) : "").trim();
    const name = rawName || "Google Mathlete";
    const email = `google.${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "") || "mathlete"}@vedax.edu`;

    let user = await User.findOne({ email });

    if (!user) {
      const password = Math.random().toString(36).substring(7);
      user = await User.create({
        name,
        email,
        password,
        joinedDate: new Date(),
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      });
    }

    res.json({
      token: generateToken(user._id),
      user: toSafeUser(user)
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error during Google sign-in" });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  res.json({ user: toSafeUser(req.user) });
};

// @desc    Verify current JWT
// @route   GET /api/auth/verify
// @access  Private
const verifyAuth = async (req, res) => {
  res.json({ valid: true, user: toSafeUser(req.user) });
};

// @desc    Logout current user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, authUser, googleLogin, getCurrentUser, verifyAuth, logoutUser, toSafeUser };
