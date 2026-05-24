const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      joinedDate: new Date().toLocaleDateString(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          accuracy: user.accuracy,
          avgSpeed: user.avgSpeed,
          completedLessons: user.completedLessons,
          challengeHighScore: user.challengeHighScore,
          avatar: user.avatar,
          badges: user.badges,
          recentActivities: user.recentActivities
        }
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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          accuracy: user.accuracy,
          avgSpeed: user.avgSpeed,
          completedLessons: user.completedLessons,
          challengeHighScore: user.challengeHighScore,
          avatar: user.avatar,
          badges: user.badges,
          recentActivities: user.recentActivities
        }
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
        joinedDate: new Date().toLocaleDateString(),
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        accuracy: user.accuracy,
        avgSpeed: user.avgSpeed,
        completedLessons: user.completedLessons,
        challengeHighScore: user.challengeHighScore,
        avatar: user.avatar,
        badges: user.badges,
        recentActivities: user.recentActivities
      }
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error during Google sign-in" });
  }
};

module.exports = { registerUser, authUser, googleLogin };

